
const SafetyRecord = require('../models/SafetyRecord');

// @desc    Get all safetyRecords
// @route   GET /api/safetyRecords
// @access  Public
const getSafetyRecords = async (req, res) => {
  try {
    const items = await SafetyRecord.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single safetyRecord
// @route   GET /api/safetyRecords/:id
// @access  Public
const getSafetyRecordById = async (req, res) => {
  try {
    const item = await SafetyRecord.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'SafetyRecord not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a safetyRecord
// @route   POST /api/safetyRecords
// @access  Public
const createSafetyRecord = async (req, res) => {
  try {
    const item = new SafetyRecord(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a safetyRecord
// @route   PUT /api/safetyRecords/:id
// @access  Public
const updateSafetyRecord = async (req, res) => {
  try {
    const item = await SafetyRecord.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'SafetyRecord not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a safetyRecord
// @route   DELETE /api/safetyRecords/:id
// @access  Public
const deleteSafetyRecord = async (req, res) => {
  try {
    const item = await SafetyRecord.findById(req.params.id);
    if (item) {
      await SafetyRecord.deleteOne({ _id: req.params.id });
      res.json({ message: 'SafetyRecord removed' });
    } else {
      res.status(404).json({ message: 'SafetyRecord not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSafetyRecords,
  getSafetyRecordById,
  createSafetyRecord,
  updateSafetyRecord,
  deleteSafetyRecord
};
