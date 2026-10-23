const express = require('express');
const router = express.Router();
const {
  getOtherExpenses,
  createOtherExpense,
  updateOtherExpense,
  deleteOtherExpense
} = require('../controllers/otherExpenseController');

router.route('/')
  .get(getOtherExpenses)
  .post(createOtherExpense);

router.route('/:id')
  .put(updateOtherExpense)
  .delete(deleteOtherExpense);

module.exports = router;
