
const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Approval = mongoose.model('Approval', ApprovalSchema);

module.exports = Approval;
