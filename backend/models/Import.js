
const mongoose = require('mongoose');

const ImportSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Import = mongoose.model('Import', ImportSchema);

module.exports = Import;
