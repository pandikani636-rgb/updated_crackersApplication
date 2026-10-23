
const PurchaseRequest = require('../models/PurchaseRequest');

// @desc    Get all purchaseRequests
// @route   GET /api/purchaseRequests
// @access  Public
const getPurchaseRequests = async (req, res) => {
  try {
    const items = await PurchaseRequest.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single purchaseRequest
// @route   GET /api/purchaseRequests/:id
// @access  Public
const getPurchaseRequestById = async (req, res) => {
  try {
    const item = await PurchaseRequest.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'PurchaseRequest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a purchaseRequest
// @route   POST /api/purchaseRequests
// @access  Public
const createPurchaseRequest = async (req, res) => {
  try {
    const item = new PurchaseRequest(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a purchaseRequest
// @route   PUT /api/purchaseRequests/:id
// @access  Public
const updatePurchaseRequest = async (req, res) => {
  try {
    const item = await PurchaseRequest.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'PurchaseRequest not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a purchaseRequest
// @route   DELETE /api/purchaseRequests/:id
// @access  Public
const deletePurchaseRequest = async (req, res) => {
  try {
    const item = await PurchaseRequest.findById(req.params.id);
    if (item) {
      await PurchaseRequest.deleteOne({ _id: req.params.id });
      res.json({ message: 'PurchaseRequest removed' });
    } else {
      res.status(404).json({ message: 'PurchaseRequest not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPurchaseRequests,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest
};
