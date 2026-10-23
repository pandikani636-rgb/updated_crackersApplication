const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  stringId: { type: String, required: false },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gst: { type: String, default: '' },
  items: { type: String, default: '' },
  status: { type: String, default: 'Active' }
}, { strict: false, timestamps: true });

const Agent = mongoose.model('Agent', AgentSchema);

module.exports = Agent;
