const OtherExpense = require('../models/OtherExpense');

// @desc    Get all other expenses
// @route   GET /api/other-expenses
const getOtherExpenses = async (req, res) => {
  try {
    const expenses = await OtherExpense.find({}).sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an other expense
// @route   POST /api/other-expenses
const createOtherExpense = async (req, res) => {
  try {
    const { reason, amount, date, notes } = req.body;
    const expense = new OtherExpense({
      reason,
      amount: Number(amount),
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || ''
    });
    const created = await expense.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an other expense
// @route   PUT /api/other-expenses/:id
const updateOtherExpense = async (req, res) => {
  try {
    const expense = await OtherExpense.findById(req.params.id);
    if (expense) {
      Object.assign(expense, req.body);
      if (req.body.amount !== undefined) expense.amount = Number(req.body.amount);
      const updated = await expense.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an other expense
// @route   DELETE /api/other-expenses/:id
const deleteOtherExpense = async (req, res) => {
  try {
    const expense = await OtherExpense.findById(req.params.id);
    if (expense) {
      await OtherExpense.deleteOne({ _id: req.params.id });
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOtherExpenses,
  createOtherExpense,
  updateOtherExpense,
  deleteOtherExpense
};
