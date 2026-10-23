
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

module.exports = AuditLog;
