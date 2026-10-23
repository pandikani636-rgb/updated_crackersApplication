
const mongoose = require('mongoose');
const WorkerAllocation = require('../models/WorkerAllocation');

// @desc    Get all worker allocations
// @route   GET /api/workerAllocations
// @access  Public
const getWorkerAllocations = async (req, res) => {
  try {
    const items = await WorkerAllocation.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a worker allocation (supports single object or array)
// @route   POST /api/workerAllocations
// @access  Public
const createWorkerAllocation = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const createdItems = await WorkerAllocation.insertMany(req.body);
      return res.status(201).json(createdItems);
    }
    const item = new WorkerAllocation(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a worker allocation
// @route   DELETE /api/workerAllocations/:id
// @access  Public
const deleteWorkerAllocation = async (req, res) => {
  try {
    const targetId = req.params.id;
    let item;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      item = await WorkerAllocation.findById(targetId);
    }
    if (!item) {
      item = await WorkerAllocation.findOne({ $or: [{ id: targetId }, { stringId: targetId }] });
    }

    if (item) {
      await WorkerAllocation.deleteOne({ _id: item._id });
      res.json({ message: 'WorkerAllocation removed' });
    } else {
      res.status(404).json({ message: 'WorkerAllocation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a worker allocation
// @route   PUT /api/workerAllocations/:id
// @access  Public
const updateWorkerAllocation = async (req, res) => {
  try {
    const { department, count, date, office, money, set, finishing, godown } = req.body;
    const updateData = {};
    if (department !== undefined) updateData.department = department;
    if (date !== undefined) updateData.date = date;
    if (office !== undefined) updateData.office = Number(office);
    if (money !== undefined) updateData.money = Number(money);
    if (set !== undefined) updateData.set = Number(set);
    if (finishing !== undefined) updateData.finishing = Number(finishing);
    if (godown !== undefined) updateData.godown = Number(godown);

    if (office !== undefined || money !== undefined || set !== undefined || finishing !== undefined || godown !== undefined) {
      const o = Number(office) || 0;
      const m = Number(money) || 0;
      const s = Number(set) || 0;
      const f = Number(finishing) || 0;
      const g = Number(godown) || 0;
      updateData.count = o + m + s + f + g;
    } else if (count !== undefined) {
      updateData.count = Number(count);
    }

    const targetId = req.params.id;
    let updatedItem;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      updatedItem = await WorkerAllocation.findByIdAndUpdate(
        targetId,
        { $set: updateData },
        { new: true }
      );
    }
    if (!updatedItem) {
      updatedItem = await WorkerAllocation.findOneAndUpdate(
        { $or: [{ id: targetId }, { stringId: targetId }] },
        { $set: updateData },
        { new: true }
      );
    }

    if (updatedItem) {
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'WorkerAllocation not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getWorkerAllocations,
  createWorkerAllocation,
  updateWorkerAllocation,
  deleteWorkerAllocation
};

