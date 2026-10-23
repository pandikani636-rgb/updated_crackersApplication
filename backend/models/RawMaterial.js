
const mongoose = require('mongoose');

const RawMaterialSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);

module.exports = RawMaterial;
