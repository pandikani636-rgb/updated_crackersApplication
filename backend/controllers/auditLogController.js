
const AuditLog = require('../models/AuditLog');

// @desc    Get all auditLogs
// @route   GET /api/auditLogs
// @access  Public
const getAuditLogs = async (req, res) => {
  try {
    const items = await AuditLog.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single auditLog
// @route   GET /api/auditLogs/:id
// @access  Public
const getAuditLogById = async (req, res) => {
  try {
    const item = await AuditLog.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'AuditLog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a auditLog
// @route   POST /api/auditLogs
// @access  Public
const createAuditLog = async (req, res) => {
  try {
    const item = new AuditLog(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a auditLog
// @route   PUT /api/auditLogs/:id
// @access  Public
const updateAuditLog = async (req, res) => {
  try {
    const item = await AuditLog.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'AuditLog not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a auditLog
// @route   DELETE /api/auditLogs/:id
// @access  Public
const deleteAuditLog = async (req, res) => {
  try {
    const item = await AuditLog.findById(req.params.id);
    if (item) {
      await AuditLog.deleteOne({ _id: req.params.id });
      res.json({ message: 'AuditLog removed' });
    } else {
      res.status(404).json({ message: 'AuditLog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuditLogs,
  getAuditLogById,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog
};
