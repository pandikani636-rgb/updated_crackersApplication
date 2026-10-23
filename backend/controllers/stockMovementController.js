const StockMovement = require('../models/StockMovement');

// @desc    Get all stock movements with filters
// @route   GET /api/stock-movements
const getStockMovements = async (req, res) => {
  try {
    const { startDate, endDate, type, productName } = req.query;
    const filter = {};

    if (type && type !== 'ALL') {
      filter.type = type;
    }

    if (productName) {
      filter.productName = { $regex: productName, $options: 'i' };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const movements = await StockMovement.find(filter).sort({ createdAt: -1 });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock movement reports
// @route   GET /api/stock-movements/reports
const getStockMovementReports = async (req, res) => {
  try {
    const movements = await StockMovement.find({}).sort({ createdAt: -1 });
    
    const stockIn = movements.filter(m => m.quantity > 0);
    const stockOut = movements.filter(m => m.quantity < 0);
    
    const totalStockInQty = stockIn.reduce((sum, m) => sum + m.quantity, 0);
    const totalStockOutQty = stockOut.reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    res.json({
      totalMovements: movements.length,
      totalStockInQty,
      totalStockOutQty,
      movements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStockMovements,
  getStockMovementReports
};
