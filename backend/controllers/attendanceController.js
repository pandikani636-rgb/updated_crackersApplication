
const Attendance = require('../models/Attendance');

// @desc    Get all attendances
// @route   GET /api/attendances
// @access  Public
const getAttendances = async (req, res) => {
  try {
    const items = await Attendance.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single attendance
// @route   GET /api/attendances/:id
// @access  Public
const getAttendanceById = async (req, res) => {
  try {
    const item = await Attendance.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a attendance
// @route   POST /api/attendances
// @access  Public
const createAttendance = async (req, res) => {
  try {
    const item = new Attendance(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a attendance
// @route   PUT /api/attendances/:id
// @access  Public
const updateAttendance = async (req, res) => {
  try {
    const item = await Attendance.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a attendance
// @route   DELETE /api/attendances/:id
// @access  Public
const deleteAttendance = async (req, res) => {
  try {
    const item = await Attendance.findById(req.params.id);
    if (item) {
      await Attendance.deleteOne({ _id: req.params.id });
      res.json({ message: 'Attendance removed' });
    } else {
      res.status(404).json({ message: 'Attendance not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
};
