const DailyRegister = require('../models/DailyRegister');
const Import = require('../models/Import');

// Helper to calculate previous day date string (YYYY-MM-DD)
const getPreviousDateStr = (dateStr) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

// @desc    Get all daily registers
// @route   GET /api/daily-registers
const getDailyRegisters = async (req, res) => {
  try {
    const { date, itemName } = req.query;
    let query = {};
    if (date) query.date = date;
    if (itemName) query.itemName = itemName;
    const records = await DailyRegister.find(query).sort({ date: -1, createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get opening stock for an item on a specific date
// @route   GET /api/daily-registers/opening-stock
const getOpeningStock = async (req, res) => {
  try {
    const { date, itemName } = req.query;
    if (!date || !itemName) {
      return res.status(400).json({ message: 'date and itemName are required' });
    }

    const prevDate = getPreviousDateStr(date);

    // 1. Check direct previous day record
    const prevRecord = await DailyRegister.findOne({ itemName, date: prevDate });
    if (prevRecord) {
      return res.json({ openingStock: prevRecord.remainingStock, source: `Previous day (${prevDate}) remaining stock` });
    }

    // 2. Check latest record prior to date
    const latestPriorRecord = await DailyRegister.findOne({ itemName, date: { $lt: date } }).sort({ date: -1 });
    if (latestPriorRecord) {
      return res.json({ openingStock: latestPriorRecord.remainingStock, source: `Prior record (${latestPriorRecord.date}) remaining stock` });
    }

    // 3. Fallback: Sum up total imports for this item up to date
    const imports = await Import.find({
      $or: [{ cracker: itemName }, { itemName: itemName }],
      date: { $lte: date }
    });
    const totalImported = imports.reduce((sum, imp) => sum + (Number(imp.bundles) || Number(imp.quantity) || 0), 0);

    res.json({ openingStock: totalImported, source: totalImported > 0 ? 'Total imports baseline' : 'Default initial' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update a daily register entry
// @route   POST /api/daily-registers
const saveDailyRegister = async (req, res) => {
  try {
    const { date, itemName, openingStock, productionQty, salesQty, remarks } = req.body;
    
    const opening = Number(openingStock || 0);
    const prod = Number(productionQty || 0);
    const sales = Number(salesQty || 0);
    const total = opening + prod;
    const remaining = total - sales;

    let record = await DailyRegister.findOne({ date, itemName });
    if (record) {
      record.openingStock = opening;
      record.productionQty = prod;
      record.totalStock = total;
      record.salesQty = sales;
      record.remainingStock = remaining;
      if (remarks !== undefined) record.remarks = remarks;
      await record.save();
    } else {
      record = new DailyRegister({
        date,
        itemName,
        openingStock: opening,
        productionQty: prod,
        totalStock: total,
        salesQty: sales,
        remainingStock: remaining,
        remarks: remarks || ''
      });
      await record.save();
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a daily register entry
// @route   DELETE /api/daily-registers/:id
const deleteDailyRegister = async (req, res) => {
  try {
    const item = await DailyRegister.findById(req.params.id);
    if (item) {
      await DailyRegister.deleteOne({ _id: req.params.id });
      res.json({ message: 'Daily register record removed' });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDailyRegisters,
  getOpeningStock,
  saveDailyRegister,
  deleteDailyRegister
};
