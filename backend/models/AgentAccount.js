const mongoose = require('mongoose');

const AgentAccountSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  agentPhone: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  givenProductAmount: {
    type: Number,
    default: 0
  },
  receivedAmount: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    default: 'Cash'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const AgentAccount = mongoose.model('AgentAccount', AgentAccountSchema);

module.exports = AgentAccount;
