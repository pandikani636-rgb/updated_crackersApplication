
const Approval = require('../models/Approval');

// @desc    Get all approvals
// @route   GET /api/approvals
// @access  Public
const getApprovals = async (req, res) => {
  try {
    const items = await Approval.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single approval
// @route   GET /api/approvals/:id
// @access  Public
const getApprovalById = async (req, res) => {
  try {
    const item = await Approval.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Approval not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a approval
// @route   POST /api/approvals
// @access  Public
const createApproval = async (req, res) => {
  try {
    const item = new Approval(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a approval
// @route   PUT /api/approvals/:id
// @access  Public
const updateApproval = async (req, res) => {
  try {
    const item = await Approval.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Approval not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a approval
// @route   DELETE /api/approvals/:id
// @access  Public
const deleteApproval = async (req, res) => {
  try {
    const item = await Approval.findById(req.params.id);
    if (item) {
      await Approval.deleteOne({ _id: req.params.id });
      res.json({ message: 'Approval removed' });
    } else {
      res.status(404).json({ message: 'Approval not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getApprovals,
  getApprovalById,
  createApproval,
  updateApproval,
  deleteApproval
};
