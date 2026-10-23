
const express = require('express');
const router = express.Router();
const {
  getActivitys,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} = require('../controllers/activityController');

router.route('/').get(getActivitys).post(createActivity);
router.route('/:id').get(getActivityById).put(updateActivity).delete(deleteActivity);

module.exports = router;
