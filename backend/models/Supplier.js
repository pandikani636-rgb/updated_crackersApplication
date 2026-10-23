
const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports = Supplier;
