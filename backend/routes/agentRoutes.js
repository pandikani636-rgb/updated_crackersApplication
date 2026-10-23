const express = require('express');
const router = express.Router();
const {
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

router.route('/').get(getAgents).post(createAgent);
router.route('/:id').get(getAgentById).put(updateAgent).delete(deleteAgent);

module.exports = router;
