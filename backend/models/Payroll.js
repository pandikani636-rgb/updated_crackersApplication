
const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Payroll = mongoose.model('Payroll', PayrollSchema);

module.exports = Payroll;
