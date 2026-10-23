
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  stringId: { type: String, required: false },
}, { strict: false, timestamps: true });

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
