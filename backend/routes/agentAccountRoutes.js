const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getSummary,
  createTransaction,
  deleteTransaction
} = require('../controllers/agentAccountController');

router.route('/').get(getTransactions).post(createTransaction);
router.route('/summary').get(getSummary);
router.route('/:id').delete(deleteTransaction);

module.exports = router;
