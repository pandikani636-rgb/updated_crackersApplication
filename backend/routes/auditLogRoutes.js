
const express = require('express');
const router = express.Router();
const {
  getAuditLogs,
  getAuditLogById,
  createAuditLog,
  updateAuditLog,
  deleteAuditLog
} = require('../controllers/auditLogController');

router.route('/').get(getAuditLogs).post(createAuditLog);
router.route('/:id').get(getAuditLogById).put(updateAuditLog).delete(deleteAuditLog);

module.exports = router;
