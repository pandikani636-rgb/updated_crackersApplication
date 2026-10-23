
const DispatchOrder = require('../models/DispatchOrder');

// @desc    Get all dispatchOrders
// @route   GET /api/dispatchOrders
// @access  Public
const getDispatchOrders = async (req, res) => {
  try {
    const items = await DispatchOrder.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single dispatchOrder
// @route   GET /api/dispatchOrders/:id
// @access  Public
const getDispatchOrderById = async (req, res) => {
  try {
    const item = await DispatchOrder.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'DispatchOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a dispatchOrder
// @route   POST /api/dispatchOrders
// @access  Public
const createDispatchOrder = async (req, res) => {
  try {
    const item = new DispatchOrder(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a dispatchOrder
// @route   PUT /api/dispatchOrders/:id
// @access  Public
const updateDispatchOrder = async (req, res) => {
  try {
    const item = await DispatchOrder.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'DispatchOrder not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a dispatchOrder
// @route   DELETE /api/dispatchOrders/:id
// @access  Public
const deleteDispatchOrder = async (req, res) => {
  try {
    const item = await DispatchOrder.findById(req.params.id);
    if (item) {
      await DispatchOrder.deleteOne({ _id: req.params.id });
      res.json({ message: 'DispatchOrder removed' });
    } else {
      res.status(404).json({ message: 'DispatchOrder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDispatchOrders,
  getDispatchOrderById,
  createDispatchOrder,
  updateDispatchOrder,
  deleteDispatchOrder
};
