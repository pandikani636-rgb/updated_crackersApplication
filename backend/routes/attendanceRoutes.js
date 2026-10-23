
const express = require('express');
const router = express.Router();
const {
  getAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendanceController');

router.route('/').get(getAttendances).post(createAttendance);
router.route('/:id').get(getAttendanceById).put(updateAttendance).delete(deleteAttendance);

module.exports = router;
