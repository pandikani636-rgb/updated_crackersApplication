
const mongoose = require('mongoose');

const BomSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Bom = mongoose.model('Bom', BomSchema);

module.exports = Bom;
