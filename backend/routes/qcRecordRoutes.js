
const express = require('express');
const router = express.Router();
const {
  getQcRecords,
  getQcRecordById,
  createQcRecord,
  updateQcRecord,
  deleteQcRecord
} = require('../controllers/qcRecordController');

router.route('/').get(getQcRecords).post(createQcRecord);
router.route('/:id').get(getQcRecordById).put(updateQcRecord).delete(deleteQcRecord);

module.exports = router;
