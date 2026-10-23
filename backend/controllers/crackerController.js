
const Cracker = require('../models/Cracker');

// @desc    Get all crackers
// @route   GET /api/crackers
// @access  Public
const getCrackers = async (req, res) => {
  try {
    const items = await Cracker.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single cracker
// @route   GET /api/crackers/:id
// @access  Public
const getCrackerById = async (req, res) => {
  try {
    const item = await Cracker.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Cracker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a cracker
// @route   POST /api/crackers
// @access  Public
const createCracker = async (req, res) => {
  try {
    const item = new Cracker(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a cracker
// @route   PUT /api/crackers/:id
// @access  Public
const updateCracker = async (req, res) => {
  try {
    const item = await Cracker.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Cracker not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a cracker
// @route   DELETE /api/crackers/:id
// @access  Public
const deleteCracker = async (req, res) => {
  try {
    const item = await Cracker.findById(req.params.id);
    if (item) {
      await Cracker.deleteOne({ _id: req.params.id });
      res.json({ message: 'Cracker removed' });
    } else {
      res.status(404).json({ message: 'Cracker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCrackers,
  getCrackerById,
  createCracker,
  updateCracker,
  deleteCracker
};
