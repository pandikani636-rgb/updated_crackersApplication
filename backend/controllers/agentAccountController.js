const AgentAccount = require('../models/AgentAccount');
const Agent = require('../models/Agent');

// @desc    Get all transactions with optional filters
// @route   GET /api/agent-accounts
// @access  Public
const getTransactions = async (req, res) => {
  try {
    const { agentId, fromDate, toDate } = req.query;
    let query = {};

    if (agentId && agentId !== 'all') {
      query.agentId = agentId;
    }

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const transactions = await AgentAccount.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get summary / balance for agent(s)
// @route   GET /api/agent-accounts/summary
// @access  Public
const getSummary = async (req, res) => {
  try {
    const { agentId } = req.query;
    let matchQuery = {};

    if (agentId && agentId !== 'all') {
      matchQuery.agentId = agentId;
    }

    const transactions = await AgentAccount.find(matchQuery).sort({ date: 1, createdAt: 1 });

    const totalGiven = transactions.reduce((sum, item) => sum + (Number(item.givenProductAmount) || 0), 0);
    const totalReceived = transactions.reduce((sum, item) => sum + (Number(item.receivedAmount) || 0), 0);
    const currentBalance = totalGiven - totalReceived;

    res.json({
      totalRecords: transactions.length,
      totalGiven,
      totalReceived,
      currentBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new transaction for an agent
// @route   POST /api/agent-accounts
// @access  Public
const createTransaction = async (req, res) => {
  try {
    const {
      agentId,
      agentName,
      agentPhone,
      date,
      givenProductAmount,
      receivedAmount,
      paymentMode,
      notes
    } = req.body;

    if (!agentId || !agentName) {
      return res.status(400).json({ message: 'Agent selection is required.' });
    }

    const given = Number(givenProductAmount) || 0;
    const received = Number(receivedAmount) || 0;

    // Calculate all previous transactions for this agent to compute running balance
    const agentTxns = await AgentAccount.find({ agentId }).sort({ date: 1, createdAt: 1 });
    const prevTotalGiven = agentTxns.reduce((sum, item) => sum + (Number(item.givenProductAmount) || 0), 0);
    const prevTotalReceived = agentTxns.reduce((sum, item) => sum + (Number(item.receivedAmount) || 0), 0);
    const previousBalance = prevTotalGiven - prevTotalReceived;

    const newBalance = previousBalance + given - received;

    const newTransaction = new AgentAccount({
      agentId,
      agentName,
      agentPhone: agentPhone || '',
      date: date ? new Date(date) : new Date(),
      givenProductAmount: given,
      receivedAmount: received,
      balanceAfter: newBalance,
      paymentMode: paymentMode || 'Cash',
      notes: notes || ''
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete transaction and recalculate subsequent running balances
// @route   DELETE /api/agent-accounts/:id
// @access  Public
const deleteTransaction = async (req, res) => {
  try {
    const item = await AgentAccount.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const agentId = item.agentId;
    await AgentAccount.deleteOne({ _id: req.params.id });

    // Recalculate running balances for all transactions of this agent
    const remainingTxns = await AgentAccount.find({ agentId }).sort({ date: 1, createdAt: 1 });
    let runningBalance = 0;
    for (const txn of remainingTxns) {
      runningBalance += (Number(txn.givenProductAmount) || 0) - (Number(txn.receivedAmount) || 0);
      txn.balanceAfter = runningBalance;
      await txn.save();
    }

    res.json({ message: 'Transaction removed and balances recalculated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  getSummary,
  createTransaction,
  deleteTransaction
};
