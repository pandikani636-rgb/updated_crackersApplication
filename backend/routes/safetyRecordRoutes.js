
const express = require('express');
const router = express.Router();
const {
  getSafetyRecords,
  getSafetyRecordById,
  createSafetyRecord,
  updateSafetyRecord,
  deleteSafetyRecord
} = require('../controllers/safetyRecordController');

router.route('/').get(getSafetyRecords).post(createSafetyRecord);
router.route('/:id').get(getSafetyRecordById).put(updateSafetyRecord).delete(deleteSafetyRecord);

module.exports = router;
