
const PackingOrder = require('../models/PackingOrder');

// @desc    Get all packingOrders
// @route   GET /api/packingOrders
// @access  Public
const getPackingOrders = async (req, res) => {
  try {
    const items = await PackingOrder.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single packingOrder
// @route   GET /api/packingOrders/:id
// @access  Public
const getPackingOrderById = async (req, res) => {
  try {
    const item = await PackingOrder.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'PackingOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a packingOrder
// @route   POST /api/packingOrders
// @access  Public
const createPackingOrder = async (req, res) => {
  try {
    const item = new PackingOrder(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a packingOrder
// @route   PUT /api/packingOrders/:id
// @access  Public
const updatePackingOrder = async (req, res) => {
  try {
    const item = await PackingOrder.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'PackingOrder not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a packingOrder
// @route   DELETE /api/packingOrders/:id
// @access  Public
const deletePackingOrder = async (req, res) => {
  try {
    const item = await PackingOrder.findById(req.params.id);
    if (item) {
      await PackingOrder.deleteOne({ _id: req.params.id });
      res.json({ message: 'PackingOrder removed' });
    } else {
      res.status(404).json({ message: 'PackingOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPackingOrders,
  getPackingOrderById,
  createPackingOrder,
  updatePackingOrder,
  deletePackingOrder
};
