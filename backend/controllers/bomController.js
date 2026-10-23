
const Bom = require('../models/Bom');

// @desc    Get all boms
// @route   GET /api/boms
// @access  Public
const getBoms = async (req, res) => {
  try {
    const items = await Bom.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bom
// @route   GET /api/boms/:id
// @access  Public
const getBomById = async (req, res) => {
  try {
    const item = await Bom.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Bom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bom
// @route   POST /api/boms
// @access  Public
const createBom = async (req, res) => {
  try {
    const item = new Bom(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a bom
// @route   PUT /api/boms/:id
// @access  Public
const updateBom = async (req, res) => {
  try {
    const item = await Bom.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Bom not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a bom
// @route   DELETE /api/boms/:id
// @access  Public
const deleteBom = async (req, res) => {
  try {
    const item = await Bom.findById(req.params.id);
    if (item) {
      await Bom.deleteOne({ _id: req.params.id });
      res.json({ message: 'Bom removed' });
    } else {
      res.status(404).json({ message: 'Bom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoms,
  getBomById,
  createBom,
  updateBom,
  deleteBom
};
