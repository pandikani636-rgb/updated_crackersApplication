const mongoose = require('mongoose');

const OtherExpenseSchema = new mongoose.Schema({
  reason: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  notes: { type: String, default: '' }
}, { strict: false, timestamps: true });

const OtherExpense = mongoose.model('OtherExpense', OtherExpenseSchema);

module.exports = OtherExpense;
