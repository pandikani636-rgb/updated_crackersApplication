const Agent = require('../models/Agent');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
const getAgents = async (req, res) => {
  try {
    const items = await Agent.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Public
const getAgentById = async (req, res) => {
  try {
    const item = await Agent.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an agent
// @route   POST /api/agents
// @access  Public
const createAgent = async (req, res) => {
  try {
    const item = new Agent(req.body);
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an agent
// @route   PUT /api/agents/:id
// @access  Public
const updateAgent = async (req, res) => {
  try {
    const item = await Agent.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an agent
// @route   DELETE /api/agents/:id
// @access  Public
const deleteAgent = async (req, res) => {
  try {
    const item = await Agent.findById(req.params.id);
    if (item) {
      await Agent.deleteOne({ _id: req.params.id });
      res.json({ message: 'Agent removed' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent
};
