
const mongoose = require('mongoose');

const SafetyRecordSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const SafetyRecord = mongoose.model('SafetyRecord', SafetyRecordSchema);

module.exports = SafetyRecord;
