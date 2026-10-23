
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
