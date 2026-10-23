
const ProductionOrder = require('../models/ProductionOrder');

// @desc    Get all productionOrders
// @route   GET /api/productionOrders
// @access  Public
const getProductionOrders = async (req, res) => {
  try {
    const items = await ProductionOrder.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single productionOrder
// @route   GET /api/productionOrders/:id
// @access  Public
const getProductionOrderById = async (req, res) => {
  try {
    const item = await ProductionOrder.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'ProductionOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a productionOrder
// @route   POST /api/productionOrders
// @access  Public
const createProductionOrder = async (req, res) => {
  try {
    const item = new ProductionOrder(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a productionOrder
// @route   PUT /api/productionOrders/:id
// @access  Public
const updateProductionOrder = async (req, res) => {
  try {
    const item = await ProductionOrder.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'ProductionOrder not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a productionOrder
// @route   DELETE /api/productionOrders/:id
// @access  Public
const deleteProductionOrder = async (req, res) => {
  try {
    const item = await ProductionOrder.findById(req.params.id);
    if (item) {
      await ProductionOrder.deleteOne({ _id: req.params.id });
      res.json({ message: 'ProductionOrder removed' });
    } else {
      res.status(404).json({ message: 'ProductionOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder
};
