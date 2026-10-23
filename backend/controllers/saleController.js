const Sale = require('../models/Sale');
const Stock = require('../models/Stock');
const StockMovement = require('../models/StockMovement');

// Helper to generate invoice number
const generateInvoiceNumber = async () => {
  const count = await Sale.countDocuments();
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(count + 1).padStart(4, '0');
  return `INV-${dateStr}-${seq}`;
};

// @desc    Get all sales
// @route   GET /api/sales
const getSales = async (req, res) => {
  try {
    const { status, customerName, startDate, endDate } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customerName) filter.customerName = { $regex: customerName, $options: 'i' };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const sales = await Sale.find(filter).sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Finalize Sale & Atomically Deduct Inventory (Critical Requirement)
// @route   POST /api/sales/finalize
const finalizeSale = async (req, res) => {
  try {
    const {
      invoiceNumber,
      customerName,
      customerPhone,
      customerAddress,
      customerGst,
      date,
      items,
      hasGst,
      gstPercentage,
      paymentMethod,
      paymentStatus,
      paidAmount,
      notes,
      user
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invoice must contain at least one product item.' });
    }

    const invNum = invoiceNumber || (await generateInvoiceNumber());
    const saleDate = date || new Date().toISOString().split('T')[0];

    // 1. Authoritative Stock Pre-validation: Check all items have sufficient stock
    const stockItemsToUpdate = [];

    for (const line of items) {
      const requestedQty = Number(line.quantity) || 0;
      if (requestedQty <= 0) {
        return res.status(400).json({ message: `Invalid quantity (${requestedQty}) for item ${line.item || line.name}` });
      }

      const itemName = (line.item || line.name || '').trim();
      // Find stock item by name or id
      let stockDoc = null;
      if (line.productId) {
        stockDoc = await Stock.findById(line.productId);
      }
      if (!stockDoc && itemName) {
        stockDoc = await Stock.findOne({ cracker: { $regex: `^${itemName}$`, $options: 'i' } });
      }

      if (!stockDoc) {
        return res.status(404).json({ message: `Inventory item "${itemName}" was not found in stock records.` });
      }

      const currentAvailable = Number(stockDoc.availableBundles) || 0;
      if (currentAvailable < requestedQty) {
        return res.status(400).json({
          message: `Insufficient stock for "${stockDoc.cracker}". Requested: ${requestedQty} Bundles, Available: ${currentAvailable} Bundles.`
        });
      }

      stockItemsToUpdate.push({
        stockDoc,
        line,
        requestedQty,
        previousStock: currentAvailable
      });
    }

    // 2. Authoritative Price, GST, and Total Recalculation
    let computedSubtotal = 0;
    let computedTotalDiscount = 0;

    const processedItems = stockItemsToUpdate.map(({ stockDoc, line, requestedQty }) => {
      const unitPrice = Number(line.unitPrice !== undefined ? line.unitPrice : (line.amountPerItem || 0));
      const discount = Number(line.discount || 0);
      const lineSubtotal = requestedQty * unitPrice;
      const lineTaxable = Math.max(0, lineSubtotal - discount);

      computedSubtotal += lineSubtotal;
      computedTotalDiscount += discount;

      return {
        productId: stockDoc._id,
        sku: line.sku || stockDoc.stringId || '',
        item: stockDoc.cracker,
        quantity: requestedQty,
        unitPrice: unitPrice,
        amountPerItem: unitPrice,
        discount: discount,
        gstRate: Number(line.gstRate || (hasGst ? (Number(gstPercentage) || 18) : 0)),
        taxableAmount: lineTaxable,
        totalAmount: lineSubtotal,
        lineTotal: lineTaxable
      };
    });

    const isGst = Boolean(hasGst);
    const taxableTotal = Math.max(0, computedSubtotal - computedTotalDiscount);
    const gstRateVal = isGst ? (Number(gstPercentage) || 18) : 0;
    const computedGstAmt = isGst ? Math.round(taxableTotal * (gstRateVal / 100)) : 0;
    const computedGrandTotal = taxableTotal + computedGstAmt;

    const finalPaid = paidAmount !== undefined ? Number(paidAmount) : computedGrandTotal;
    const finalBalance = Math.max(0, computedGrandTotal - finalPaid);

    // 3. Atomically Deduct Stock & Record Stock Movement
    const movementRecords = [];

    for (const updateInfo of stockItemsToUpdate) {
      const { stockDoc, requestedQty, previousStock } = updateInfo;
      const packetsPerBundle = Number(stockDoc.packetsPerBundle) || 100;
      const packetsDeduction = requestedQty * packetsPerBundle;
      const newStock = previousStock - requestedQty;

      const reorderLevel = Number(stockDoc.reorderLevel) || 20;
      let newStatus = 'In Stock';
      if (newStock <= 0) {
        newStatus = 'Out of Stock';
      } else if (newStock <= reorderLevel) {
        newStatus = 'Low Stock';
      }

      // Atomic Update
      await Stock.updateOne(
        { _id: stockDoc._id },
        {
          $inc: {
            availableBundles: -requestedQty,
            availablePackets: -packetsDeduction,
            totalExported: requestedQty
          },
          $set: {
            status: newStatus,
            lastUpdated: saleDate
          }
        }
      );

      // Create Stock Movement Audit Record
      const movement = new StockMovement({
        productId: stockDoc._id,
        productName: stockDoc.cracker,
        sku: stockDoc.stringId || '',
        quantity: -requestedQty,
        type: 'SALE',
        invoiceNumber: invNum,
        previousStock,
        newStock,
        unit: 'Bundles',
        user: user || 'Store Billing Desk',
        date: saleDate,
        notes: `Billed to ${customerName || 'Walk-in Customer'} (Invoice #${invNum})`
      });

      await movement.save();
      movementRecords.push(movement);
    }

    // 4. Save Finalized Sale Record
    const sale = new Sale({
      invoiceNumber: invNum,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      customerAddress: customerAddress || '',
      customerGst: customerGst || '',
      date: saleDate,
      items: processedItems,
      subtotal: computedSubtotal,
      totalDiscount: computedTotalDiscount,
      taxableAmount: taxableTotal,
      hasGst: isGst,
      gstPercentage: gstRateVal,
      gstAmount: computedGstAmt,
      grandTotal: computedGrandTotal,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: paymentStatus || (finalBalance === 0 ? 'Paid' : (finalPaid > 0 ? 'Partial' : 'Pending')),
      paidAmount: finalPaid,
      balanceAmount: finalBalance,
      status: 'Finalized',
      notes: notes || '',
      createdBy: user || 'Admin'
    });

    const savedSale = await sale.save();

    res.status(201).json({
      success: true,
      sale: savedSale,
      movements: movementRecords,
      message: `Invoice #${invNum} finalized successfully. Stock deducted.`
    });
  } catch (error) {
    console.error('Finalize Sale Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error while finalizing sale.' });
  }
};

// @desc    Cancel / Reverse a finalized sale & restore stock
// @route   POST /api/sales/:id/cancel
const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale invoice not found.' });
    }

    if (sale.status === 'Cancelled') {
      return res.status(400).json({ message: 'This invoice is already cancelled.' });
    }

    // Restore stock for all items
    for (const item of sale.items) {
      const qty = Number(item.quantity) || 0;
      if (qty > 0) {
        const stockDoc = await Stock.findOne({ cracker: item.item });
        if (stockDoc) {
          const currentStock = Number(stockDoc.availableBundles) || 0;
          const restoredStock = currentStock + qty;
          const packetsPerBundle = Number(stockDoc.packetsPerBundle) || 100;

          const reorderLevel = Number(stockDoc.reorderLevel) || 20;
          const newStatus = restoredStock > reorderLevel ? 'In Stock' : (restoredStock > 0 ? 'Low Stock' : 'Out of Stock');

          await Stock.updateOne(
            { _id: stockDoc._id },
            {
              $inc: {
                availableBundles: qty,
                availablePackets: qty * packetsPerBundle,
                totalExported: -qty
              },
              $set: {
                status: newStatus,
                lastUpdated: new Date().toISOString().split('T')[0]
              }
            }
          );

          // Record restoration movement
          await StockMovement.create({
            productId: stockDoc._id,
            productName: stockDoc.cracker,
            sku: item.sku || '',
            quantity: qty,
            type: 'CANCELLATION',
            invoiceNumber: sale.invoiceNumber,
            previousStock: currentStock,
            newStock: restoredStock,
            unit: 'Bundles',
            user: req.body.user || 'Admin',
            date: new Date().toISOString().split('T')[0],
            notes: `Stock restored from cancelled invoice #${sale.invoiceNumber}`
          });
        }
      }
    }

    sale.status = 'Cancelled';
    await sale.save();

    res.json({
      success: true,
      sale,
      message: `Invoice #${sale.invoiceNumber} cancelled and stock successfully restored.`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Sales & Billing Analytics / Reports
// @route   GET /api/sales/reports
const getSaleReports = async (req, res) => {
  try {
    const sales = await Sale.find({}).sort({ createdAt: -1 });

    const finalizedSales = sales.filter(s => s.status === 'Finalized');
    const totalSalesRevenue = finalizedSales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const totalTaxCollected = finalizedSales.reduce((sum, s) => sum + (Number(s.gstAmount) || 0), 0);
    const totalDiscountsGiven = finalizedSales.reduce((sum, s) => sum + (Number(s.totalDiscount) || 0), 0);
    const totalNetTaxable = finalizedSales.reduce((sum, s) => sum + (Number(s.taxableAmount || s.subtotal) || 0), 0);

    const paidInvoices = finalizedSales.filter(s => s.paymentStatus === 'Paid');
    const pendingInvoices = finalizedSales.filter(s => s.paymentStatus === 'Pending' || s.paymentStatus === 'Partial');
    const cancelledInvoices = sales.filter(s => s.status === 'Cancelled');

    // Product-wise sales summary
    const productSalesMap = {};
    finalizedSales.forEach(s => {
      (s.items || []).forEach(item => {
        const name = item.item;
        if (!productSalesMap[name]) {
          productSalesMap[name] = { name, totalQuantity: 0, totalRevenue: 0 };
        }
        productSalesMap[name].totalQuantity += Number(item.quantity) || 0;
        productSalesMap[name].totalRevenue += Number(item.totalAmount || item.lineTotal) || 0;
      });
    });

    res.json({
      summary: {
        totalInvoices: sales.length,
        finalizedCount: finalizedSales.length,
        cancelledCount: cancelledInvoices.length,
        totalSalesRevenue,
        totalNetTaxable,
        totalTaxCollected,
        totalDiscountsGiven,
        paidInvoicesCount: paidInvoices.length,
        pendingInvoicesCount: pendingInvoices.length
      },
      productSales: Object.values(productSalesMap),
      recentInvoices: sales.slice(0, 50)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a draft/legacy sale
// @route   POST /api/sales
const createSale = async (req, res) => {
  try {
    const invNum = req.body.invoiceNumber || (await generateInvoiceNumber());
    const sale = new Sale({
      ...req.body,
      invoiceNumber: invNum
    });
    const createdSale = await sale.save();
    res.status(201).json(createdSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a sale
// @route   PUT /api/sales/:id
const updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      Object.assign(sale, req.body);
      const updatedSale = await sale.save();
      res.json(updatedSale);
    } else {
      res.status(404).json({ message: 'Sale record not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a sale
// @route   DELETE /api/sales/:id
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      await Sale.deleteOne({ _id: req.params.id });
      res.json({ message: 'Sale record removed' });
    } else {
      res.status(404).json({ message: 'Sale record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSales,
  finalizeSale,
  cancelSale,
  getSaleReports,
  createSale,
  updateSale,
  deleteSale
};
