
const express = require('express');
const router = express.Router();
const {
  getPayrolls,
  getPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll
} = require('../controllers/payrollController');

router.route('/').get(getPayrolls).post(createPayroll);
router.route('/:id').get(getPayrollById).put(updatePayroll).delete(deletePayroll);

module.exports = router;
