
const mongoose = require('mongoose');

const WorkerSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Worker = mongoose.model('Worker', WorkerSchema);

module.exports = Worker;
