
const Activity = require('../models/Activity');

// @desc    Get all activitys
// @route   GET /api/activitys
// @access  Public
const getActivitys = async (req, res) => {
  try {
    const items = await Activity.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activitys/:id
// @access  Public
const getActivityById = async (req, res) => {
  try {
    const item = await Activity.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a activity
// @route   POST /api/activitys
// @access  Public
const createActivity = async (req, res) => {
  try {
    const item = new Activity(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a activity
// @route   PUT /api/activitys/:id
// @access  Public
const updateActivity = async (req, res) => {
  try {
    const item = await Activity.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a activity
// @route   DELETE /api/activitys/:id
// @access  Public
const deleteActivity = async (req, res) => {
  try {
    const item = await Activity.findById(req.params.id);
    if (item) {
      await Activity.deleteOne({ _id: req.params.id });
      res.json({ message: 'Activity removed' });
    } else {
      res.status(404).json({ message: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivitys,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
};
