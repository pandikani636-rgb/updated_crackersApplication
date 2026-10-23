
const express = require('express');
const router = express.Router();
const {
  getApprovals,
  getApprovalById,
  createApproval,
  updateApproval,
  deleteApproval
} = require('../controllers/approvalController');

router.route('/').get(getApprovals).post(createApproval);
router.route('/:id').get(getApprovalById).put(updateApproval).delete(deleteApproval);

module.exports = router;
