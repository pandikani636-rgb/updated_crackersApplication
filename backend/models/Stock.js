
const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;
