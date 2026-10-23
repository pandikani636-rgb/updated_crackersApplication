
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
