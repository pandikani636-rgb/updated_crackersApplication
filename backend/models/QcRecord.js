
const mongoose = require('mongoose');

const QcRecordSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const QcRecord = mongoose.model('QcRecord', QcRecordSchema);

module.exports = QcRecord;
