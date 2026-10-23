
const mongoose = require('mongoose');

const PurchaseRequestSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const PurchaseRequest = mongoose.model('PurchaseRequest', PurchaseRequestSchema);

module.exports = PurchaseRequest;
