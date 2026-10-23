
const mongoose = require('mongoose');

const PackingOrderSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const PackingOrder = mongoose.model('PackingOrder', PackingOrderSchema);

module.exports = PackingOrder;
