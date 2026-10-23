
const mongoose = require('mongoose');

const DispatchOrderSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const DispatchOrder = mongoose.model('DispatchOrder', DispatchOrderSchema);

module.exports = DispatchOrder;
