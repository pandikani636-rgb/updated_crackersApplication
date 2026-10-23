
const Import = require('../models/Import');

// @desc    Get all imports
// @route   GET /api/imports
// @access  Public
const getImports = async (req, res) => {
  try {
    const items = await Import.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single import
// @route   GET /api/imports/:id
// @access  Public
const getImportById = async (req, res) => {
  try {
    const item = await Import.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Import not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a import
// @route   POST /api/imports
// @access  Public
const createImport = async (req, res) => {
  try {
    const item = new Import(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a import
// @route   PUT /api/imports/:id
// @access  Public
const updateImport = async (req, res) => {
  try {
    const item = await Import.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Import not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a import
// @route   DELETE /api/imports/:id
// @access  Public
const deleteImport = async (req, res) => {
  try {
    const item = await Import.findById(req.params.id);
    if (item) {
      await Import.deleteOne({ _id: req.params.id });
      res.json({ message: 'Import removed' });
    } else {
      res.status(404).json({ message: 'Import not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getImports,
  getImportById,
  createImport,
  updateImport,
  deleteImport
};
