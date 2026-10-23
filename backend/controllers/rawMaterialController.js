
const RawMaterial = require('../models/RawMaterial');

// @desc    Get all rawMaterials
// @route   GET /api/rawMaterials
// @access  Public
const getRawMaterials = async (req, res) => {
  try {
    const items = await RawMaterial.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single rawMaterial
// @route   GET /api/rawMaterials/:id
// @access  Public
const getRawMaterialById = async (req, res) => {
  try {
    const item = await RawMaterial.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'RawMaterial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a rawMaterial
// @route   POST /api/rawMaterials
// @access  Public
const createRawMaterial = async (req, res) => {
  try {
    const item = new RawMaterial(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a rawMaterial
// @route   PUT /api/rawMaterials/:id
// @access  Public
const updateRawMaterial = async (req, res) => {
  try {
    const item = await RawMaterial.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'RawMaterial not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a rawMaterial
// @route   DELETE /api/rawMaterials/:id
// @access  Public
const deleteRawMaterial = async (req, res) => {
  try {
    const item = await RawMaterial.findById(req.params.id);
    if (item) {
      await RawMaterial.deleteOne({ _id: req.params.id });
      res.json({ message: 'RawMaterial removed' });
    } else {
      res.status(404).json({ message: 'RawMaterial not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRawMaterials,
  getRawMaterialById,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial
};
