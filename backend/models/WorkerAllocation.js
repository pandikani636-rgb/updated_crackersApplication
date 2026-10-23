
const mongoose = require('mongoose');

const WorkerAllocationSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
  id: { type: String, required: false },
  date: { type: String, required: true },
  office: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  set: { type: Number, default: 0 },
  finishing: { type: Number, default: 0 },
  godown: { type: Number, default: 0 },
  time: { type: String, required: false }
}, { strict: false, timestamps: true });

const WorkerAllocation = mongoose.model('WorkerAllocation', WorkerAllocationSchema);

module.exports = WorkerAllocation;

