
const mongoose = require('mongoose');

const ExportSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Export = mongoose.model('Export', ExportSchema);

module.exports = Export;
