const Stock = require('../models/Stock');
const Cracker = require('../models/Cracker');
const ShopItem = require('../models/ShopItem');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res) => {
  try {
    const items = await Stock.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a stock
// @route   POST /api/stocks
// @access  Public
const createStock = async (req, res) => {
  try {
    const item = new Stock(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a stock
// @route   PUT /api/stocks/:id
// @access  Public
const updateStock = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a stock
// @route   DELETE /api/stocks/:id
// @access  Public
const deleteStock = async (req, res) => {
  try {
    const item = await Stock.findById(req.params.id);
    if (item) {
      await Stock.deleteOne({ _id: req.params.id });
      res.json({ message: 'Stock removed' });
    } else {
      res.status(404).json({ message: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available inventory for Billing (Single Source of Truth)
// @route   GET /api/stocks/available-inventory
const getAvailableInventory = async (req, res) => {
  try {
    const [stocks, crackers, shopItems] = await Promise.all([
      Stock.find({}),
      Cracker.find({}),
      ShopItem.find({})
    ]);

    // Create lookup map for crackers
    const crackerMap = new Map();
    crackers.forEach(c => {
      if (c.name) crackerMap.set(c.name.trim().toLowerCase(), c);
      if (c.stringId) crackerMap.set(c.stringId.toLowerCase(), c);
    });

    const inventory = stocks.map(stk => {
      const nameKey = (stk.cracker || '').trim().toLowerCase();
      const matchedCracker = crackerMap.get(nameKey) || null;
      
      const availableBundles = Number(stk.availableBundles) || 0;
      const reorderLevel = Number(stk.reorderLevel) || (matchedCracker?.reorderLevel || 15);
      const packetsPerBundle = Number(stk.packetsPerBundle) || (matchedCracker?.packetsPerBundle || 100);
      const sellingPrice = Number(matchedCracker?.pricePerBundle) || (Number(stk.sellingPrice) || 4500);
      const costPrice = Number(matchedCracker?.wholesalePrice) || Math.round(sellingPrice * 0.75); // Cost basis
      const sku = matchedCracker?.sku || `SKU-${(stk.cracker || 'CRK').substring(0, 3).toUpperCase()}-${packetsPerBundle}`;

      let status = 'In Stock';
      if (availableBundles <= 0) {
        status = 'Out of Stock';
      } else if (availableBundles <= reorderLevel) {
        status = 'Low Stock';
      }

      return {
        _id: stk._id,
        stockId: stk.stringId || stk._id,
        name: stk.cracker || 'Fireworks Cracker',
        cracker: stk.cracker || 'Fireworks Cracker',
        sku,
        category: stk.category || matchedCracker?.category || 'General Crackers',
        availableQuantity: availableBundles,
        availableBundles,
        availablePackets: Number(stk.availablePackets) || (availableBundles * packetsPerBundle),
        unit: 'Bundles',
        packetsPerBundle,
        sellingPrice,
        price: sellingPrice,
        costPrice,
        mrp: Number(matchedCracker?.mrp) || Math.round(sellingPrice * 1.25),
        wholesalePrice: Number(matchedCracker?.wholesalePrice) || costPrice,
        reorderLevel,
        gstRate: 18,
        status,
        lastUpdated: stk.lastUpdated || new Date().toISOString().split('T')[0]
      };
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Comprehensive Inventory Reports (Valuation, Low Stock, etc.)
// @route   GET /api/stocks/reports
const getStockReports = async (req, res) => {
  try {
    const [stocks, crackers] = await Promise.all([
      Stock.find({}),
      Cracker.find({})
    ]);

    const crackerMap = new Map();
    crackers.forEach(c => {
      if (c.name) crackerMap.set(c.name.trim().toLowerCase(), c);
    });

    let totalValuation = 0; // Cost basis
    let totalSellingValuation = 0;
    let totalBundles = 0;
    let lowStockItems = [];
    let outOfStockItems = [];

    const detailedStock = stocks.map(stk => {
      const nameKey = (stk.cracker || '').trim().toLowerCase();
      const matched = crackerMap.get(nameKey);
      
      const bundles = Number(stk.availableBundles) || 0;
      const reorder = Number(stk.reorderLevel) || 20;
      const sellingPrice = Number(matched?.pricePerBundle) || 4500;
      const costPrice = Number(matched?.wholesalePrice) || Math.round(sellingPrice * 0.75); // Cost basis

      const itemValuation = bundles * costPrice;
      const itemPotentialRevenue = bundles * sellingPrice;

      totalValuation += itemValuation;
      totalSellingValuation += itemPotentialRevenue;
      totalBundles += bundles;

      const itemData = {
        _id: stk._id,
        name: stk.cracker,
        category: stk.category || 'Sound Crackers',
        availableBundles: bundles,
        availablePackets: Number(stk.availablePackets) || 0,
        reorderLevel: reorder,
        costPrice,
        sellingPrice,
        valuation: itemValuation,
        potentialRevenue: itemPotentialRevenue,
        status: bundles <= 0 ? 'Out of Stock' : (bundles <= reorder ? 'Low Stock' : 'In Stock')
      };

      if (bundles <= 0) {
        outOfStockItems.push(itemData);
      } else if (bundles <= reorder) {
        lowStockItems.push(itemData);
      }

      return itemData;
    });

    res.json({
      summary: {
        totalProducts: stocks.length,
        totalBundles,
        totalValuation, // Cost basis
        totalSellingValuation,
        potentialGrossProfit: totalSellingValuation - totalValuation,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length
      },
      detailedStock,
      lowStockItems,
      outOfStockItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  getAvailableInventory,
  getStockReports
};
