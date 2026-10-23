
const QcRecord = require('../models/QcRecord');

// @desc    Get all qcRecords
// @route   GET /api/qcRecords
// @access  Public
const getQcRecords = async (req, res) => {
  try {
    const items = await QcRecord.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single qcRecord
// @route   GET /api/qcRecords/:id
// @access  Public
const getQcRecordById = async (req, res) => {
  try {
    const item = await QcRecord.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'QcRecord not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a qcRecord
// @route   POST /api/qcRecords
// @access  Public
const createQcRecord = async (req, res) => {
  try {
    const item = new QcRecord(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a qcRecord
// @route   PUT /api/qcRecords/:id
// @access  Public
const updateQcRecord = async (req, res) => {
  try {
    const item = await QcRecord.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'QcRecord not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a qcRecord
// @route   DELETE /api/qcRecords/:id
// @access  Public
const deleteQcRecord = async (req, res) => {
  try {
    const item = await QcRecord.findById(req.params.id);
    if (item) {
      await QcRecord.deleteOne({ _id: req.params.id });
      res.json({ message: 'QcRecord removed' });
    } else {
      res.status(404).json({ message: 'QcRecord not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQcRecords,
  getQcRecordById,
  createQcRecord,
  updateQcRecord,
  deleteQcRecord
};
