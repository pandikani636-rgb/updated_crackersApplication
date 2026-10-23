
const Export = require('../models/Export');

// @desc    Get all exports
// @route   GET /api/exports
// @access  Public
const getExports = async (req, res) => {
  try {
    const items = await Export.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single export
// @route   GET /api/exports/:id
// @access  Public
const getExportById = async (req, res) => {
  try {
    const item = await Export.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Export not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a export
// @route   POST /api/exports
// @access  Public
const createExport = async (req, res) => {
  try {
    const item = new Export(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a export
// @route   PUT /api/exports/:id
// @access  Public
const updateExport = async (req, res) => {
  try {
    const item = await Export.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Export not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a export
// @route   DELETE /api/exports/:id
// @access  Public
const deleteExport = async (req, res) => {
  try {
    const item = await Export.findById(req.params.id);
    if (item) {
      await Export.deleteOne({ _id: req.params.id });
      res.json({ message: 'Export removed' });
    } else {
      res.status(404).json({ message: 'Export not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExports,
  getExportById,
  createExport,
  updateExport,
  deleteExport
};
