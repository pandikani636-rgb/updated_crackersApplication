
const Payroll = require('../models/Payroll');

// @desc    Get all payrolls
// @route   GET /api/payrolls
// @access  Public
const getPayrolls = async (req, res) => {
  try {
    const items = await Payroll.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single payroll
// @route   GET /api/payrolls/:id
// @access  Public
const getPayrollById = async (req, res) => {
  try {
    const item = await Payroll.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a payroll
// @route   POST /api/payrolls
// @access  Public
const createPayroll = async (req, res) => {
  try {
    const item = new Payroll(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a payroll
// @route   PUT /api/payrolls/:id
// @access  Public
const updatePayroll = async (req, res) => {
  try {
    const item = await Payroll.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a payroll
// @route   DELETE /api/payrolls/:id
// @access  Public
const deletePayroll = async (req, res) => {
  try {
    const item = await Payroll.findById(req.params.id);
    if (item) {
      await Payroll.deleteOne({ _id: req.params.id });
      res.json({ message: 'Payroll removed' });
    } else {
      res.status(404).json({ message: 'Payroll not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll
};
