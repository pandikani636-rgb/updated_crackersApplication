
const mongoose = require('mongoose');

const ProductionOrderSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const ProductionOrder = mongoose.model('ProductionOrder', ProductionOrderSchema);

module.exports = ProductionOrder;
