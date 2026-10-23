
const express = require('express');
const router = express.Router();
const {
  getWorkerAllocations,
  createWorkerAllocation,
  updateWorkerAllocation,
  deleteWorkerAllocation
} = require('../controllers/workerAllocationController');

router.route('/').get(getWorkerAllocations).post(createWorkerAllocation);
router.route('/:id').get(getWorkerAllocations).put(updateWorkerAllocation).delete(deleteWorkerAllocation);

module.exports = router;

