
const mongoose = require('mongoose');

const CrackerSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Cracker = mongoose.model('Cracker', CrackerSchema);

module.exports = Cracker;
