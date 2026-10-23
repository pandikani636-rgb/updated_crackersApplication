
const Worker = require('../models/Worker');

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res) => {
  try {
    const items = await Worker.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res) => {
  try {
    const item = await Worker.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a worker
// @route   POST /api/workers
// @access  Public
const createWorker = async (req, res) => {
  try {
    const item = new Worker(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a worker
// @route   PUT /api/workers/:id
// @access  Public
const updateWorker = async (req, res) => {
  try {
    const item = await Worker.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a worker
// @route   DELETE /api/workers/:id
// @access  Public
const deleteWorker = async (req, res) => {
  try {
    const item = await Worker.findById(req.params.id);
    if (item) {
      await Worker.deleteOne({ _id: req.params.id });
      res.json({ message: 'Worker removed' });
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker
};
