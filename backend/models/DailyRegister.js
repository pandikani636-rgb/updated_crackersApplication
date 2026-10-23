const mongoose = require('mongoose');

const DailyRegisterSchema = new mongoose.Schema({
  date: { type: String, required: true },
  itemName: { type: String, required: true },
  openingStock: { type: Number, default: 0 },
  productionQty: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  salesQty: { type: Number, default: 0 },
  remainingStock: { type: Number, default: 0 },
  remarks: { type: String, default: '' }
}, { strict: false, timestamps: true });

const DailyRegister = mongoose.model('DailyRegister', DailyRegisterSchema);

module.exports = DailyRegister;
