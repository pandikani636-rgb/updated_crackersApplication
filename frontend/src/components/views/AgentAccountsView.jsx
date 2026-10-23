import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  CreditCard,
  User,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  Loader2,
  RefreshCw,
  Wallet,
  Receipt,
  FileText,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';


export const AgentAccountsView = () => {
  const { showToast, setCurrentTab } = useApp();

  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [summary, setSummary] = useState({
    totalRecords: 0,
    totalGiven: 0,
    totalReceived: 0,
    currentBalance: 0
  });

  const [formData, setFormData] = useState({
    givenProductAmount: '',
    receivedAmount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash',
    notes: ''
  });

  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isLoadingTxns, setIsLoadingTxns] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      const found = agents.find((a) => a._id === selectedAgentId);
      setSelectedAgent(found || null);
      fetchAgentData(selectedAgentId);
    } else {
      setSelectedAgent(null);
      fetchAgentData('');
    }
  }, [selectedAgentId, agents]);

  const fetchAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const res = await axios.get(`${API_URL}/agents`);
      setAgents(res.data);
      if (res.data.length > 0 && !selectedAgentId) {
        setSelectedAgentId(res.data[0]._id);
      }
    } catch (err) {
      if (showToast) showToast('Failed to load agents list', 'error');
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const fetchAgentData = async (agentId) => {
    setIsLoadingTxns(true);
    try {
      const [txnsRes, summaryRes] = await Promise.all([
        axios.get(`${API_URL}/agent-accounts`, {
          params: agentId ? { agentId } : {}
        }),
        axios.get(`${API_URL}/agent-accounts/summary`, {
          params: agentId ? { agentId } : {}
        })
      ]);
      setTransactions(txnsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      if (showToast) showToast('Failed to fetch account transactions', 'error');
    } finally {
      setIsLoadingTxns(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAgent) {
      if (showToast) showToast('Please select an agent first', 'error');
      return;
    }

    const given = parseFloat(formData.givenProductAmount) || 0;
    const received = parseFloat(formData.receivedAmount) || 0;

    if (given === 0 && received === 0) {
      if (showToast) showToast('Please enter either Given Product Amount or Received Amount', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/agent-accounts`, {
        agentId: selectedAgent._id,
        agentName: selectedAgent.name,
        agentPhone: selectedAgent.phone || '',
        date: formData.date,
        givenProductAmount: given,
        receivedAmount: received,
        paymentMode: formData.paymentMode,
        notes: formData.notes
      });

      if (showToast) showToast('Agent account updated successfully!', 'success');

      setFormData({
        givenProductAmount: '',
        receivedAmount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        notes: ''
      });

      fetchAgentData(selectedAgent._id);
    } catch (err) {
      if (showToast) showToast(err.response?.data?.message || 'Failed to record transaction', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction record?')) return;
    try {
      await axios.delete(`${API_URL}/agent-accounts/${id}`);
      if (showToast) showToast('Transaction deleted and balance recalculated!', 'success');
      fetchAgentData(selectedAgentId);
    } catch (err) {
      if (showToast) showToast('Failed to delete transaction', 'error');
    }
  };

  // Live calculation preview
  const liveGiven = parseFloat(formData.givenProductAmount) || 0;
  const liveReceived = parseFloat(formData.receivedAmount) || 0;
  const currentBal = summary.currentBalance || 0;
  const previewNewBalance = currentBal + liveGiven - liveReceived;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Wallet className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Agent Accounts Ledger
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Record cracker product amounts given to agents and track payments received with automatic running balance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('AgentReports')}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> View Agent Reports
          </button>
        </div>
      </div>

      {/* Agent Selector Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Select Agent Account
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full md:max-w-md px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
            >
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} {agent.phone ? `(${agent.phone})` : ''} — [{agent.status || 'Active'}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAgent && (
          <div className="flex items-center gap-4 bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <div>
              <p className="text-[11px] text-slate-400">Selected Agent</p>
              <p className="text-sm font-bold text-white">{selectedAgent.name}</p>
            </div>
            <div className="h-7 w-[1px] bg-slate-800" />
            <div>
              <p className="text-[11px] text-slate-400">Contact</p>
              <p className="text-xs font-semibold text-emerald-400">{selectedAgent.phone || 'N/A'}</p>
            </div>
            {selectedAgent.gst && (
              <>
                <div className="h-7 w-[1px] bg-slate-800" />
                <div>
                  <p className="text-[11px] text-slate-400">GSTIN</p>
                  <p className="text-xs font-mono text-amber-300">{selectedAgent.gst}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* KPI Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Given Product Amount */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Total Crackers Delivered
            </p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              ₹{Number(summary.totalGiven || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Crackers amount given to client</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Total Received Amount */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Total Amount Received
            </p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              ₹{Number(summary.totalReceived || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Amount given by agent to admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        {/* Current Outstanding Balance */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-orange-400" /> Current Outstanding Balance
            </p>
            <p className="text-2xl font-black text-orange-400 mt-1">
              ₹{Number(summary.currentBalance || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">To be returned by the agent</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Transaction Entry Form */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="border-b border-slate-800 pb-4 mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-400" /> Account Entry for{' '}
                <span className="text-orange-400">{selectedAgent?.name || 'Selected Agent'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enter cracker sales amount delivered or payment received from agent.
              </p>
            </div>
            <span className="text-[11px] text-emerald-400/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
              Live Balance Auto-Calculation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Input Box 1: Crackers Products Amount (Given to client) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-amber-400" /> Crackers Products Amount (Given)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">₹</span>
                <input
                  type="number"
                  name="givenProductAmount"
                  min="0"
                  step="any"
                  value={formData.givenProductAmount}
                  onChange={handleInputChange}
                  placeholder="e.g. 20000 or 50000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">Value of cracker products delivered to client</p>
            </div>

            {/* Input Box 2: Amount Given by Agent (Received by Admin) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Amount Given by Agent (Received)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">₹</span>
                <input
                  type="number"
                  name="receivedAmount"
                  min="0"
                  step="any"
                  value={formData.receivedAmount}
                  onChange={handleInputChange}
                  placeholder="e.g. 30000"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">Amount paid by agent back to admin</p>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" /> Transaction Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
              />
              <p className="text-[11px] text-slate-500">Date of transaction entry</p>
            </div>

            {/* Payment Mode */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" /> Payment Mode
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:border-purple-500 transition-all"
              >
                <option value="Cash">Cash</option>
                <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
                <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cheque">Cheque</option>
                <option value="Credit / Delivery Challan">Credit / Delivery Challan</option>
              </select>
              <p className="text-[11px] text-slate-500">Mode of payment / settlement</p>
            </div>
          </div>

          {/* Notes input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Remarks / Invoice Notes (Optional)
            </label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="e.g. Festival Batch 1 order dispatch / partial payment clearance"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Calculation Preview Banner */}
          {(liveGiven > 0 || liveReceived > 0) && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  <strong>Calculation Breakdown:</strong> Previous Balance (₹{currentBal.toLocaleString('en-IN')}) +
                  Product Given (₹{liveGiven.toLocaleString('en-IN')}) - Amount Received (₹{liveReceived.toLocaleString('en-IN')})
                </span>
              </div>
              <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-xl border border-orange-500/20 shrink-0">
                <span className="text-slate-400 text-xs">Resulting Balance:</span>
                <span className="font-black text-orange-400 text-sm">
                  ₹{previewNewBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  givenProductAmount: '',
                  receivedAmount: '',
                  date: new Date().toISOString().split('T')[0],
                  paymentMode: 'Cash',
                  notes: ''
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 font-semibold text-xs transition-all"
            >
              Clear Fields
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !selectedAgent}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Recording Entry...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Record Account Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Transactions History Ledger Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-orange-400" /> Account Transaction History (
            {selectedAgent ? selectedAgent.name : 'All Agents'} — {transactions.length} Records)
          </h4>

          <button
            onClick={() => fetchAgentData(selectedAgentId)}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition-all"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingTxns ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <p className="text-xs font-semibold">Loading transaction records...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Receipt className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-bold text-slate-300">No account entries recorded yet</p>
            <p className="text-xs text-slate-500">
              Use the form above to add products delivered or payments received for this agent.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60 font-semibold">
                  <th className="py-3.5 px-5">S.No</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Agent Name</th>
                  <th className="py-3.5 px-5 text-right">Crackers Product Amount (Given)</th>
                  <th className="py-3.5 px-5 text-right">Amount Given by Agent (Paid)</th>
                  <th className="py-3.5 px-5 text-right">Running Balance</th>
                  <th className="py-3.5 px-5">Mode & Notes</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {transactions.map((txn, index) => (
                  <tr key={txn._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-orange-400">{index + 1}</td>

                    <td className="py-3.5 px-5 text-slate-300 font-mono">
                      {new Date(txn.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-bold text-slate-100">{txn.agentName}</p>
                      {txn.agentPhone && <p className="text-[10px] text-slate-400">{txn.agentPhone}</p>}
                    </td>

                    {/* Given Product Amount */}
                    <td className="py-3.5 px-5 text-right font-bold text-amber-400 font-mono">
                      {txn.givenProductAmount > 0 ? `₹${Number(txn.givenProductAmount).toLocaleString('en-IN')}` : '-'}
                    </td>

                    {/* Received Amount */}
                    <td className="py-3.5 px-5 text-right font-bold text-emerald-400 font-mono">
                      {txn.receivedAmount > 0 ? `₹${Number(txn.receivedAmount).toLocaleString('en-IN')}` : '-'}
                    </td>

                    {/* Running Balance */}
                    <td className="py-3.5 px-5 text-right font-black text-orange-400 font-mono">
                      ₹{Number(txn.balanceAfter || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Payment Mode & Notes */}
                    <td className="py-3.5 px-5">
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                          {txn.paymentMode || 'Cash'}
                        </span>
                        {txn.notes && <p className="text-[11px] text-slate-400 italic max-w-xs truncate">{txn.notes}</p>}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedTxn(txn);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-orange-400 bg-slate-800/80 hover:bg-orange-500/10 border border-slate-700/60 hover:border-orange-500/30 transition-all"
                          title={txn.givenProductAmount > 0 ? "Print Consignment Invoice" : "Print Official Receipt"}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(txn._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agent Invoice / Receipt Modal */}
      {isInvoiceModalOpen && selectedTxn && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedTxn(null);
          }}
          type={selectedTxn.givenProductAmount > 0 ? 'AGENT_INVOICE' : 'AGENT_RECEIPT'}
          data={
            selectedTxn.givenProductAmount > 0
              ? {
                  id: `AG-INV-${(selectedTxn._id || '001').slice(-6).toUpperCase()}`,
                  agentName: selectedTxn.agentName || (selectedAgent && selectedAgent.name) || 'Agent',
                  agentPhone: selectedTxn.agentPhone || (selectedAgent && selectedAgent.phone) || '',
                  date: selectedTxn.date ? selectedTxn.date.split('T')[0] : new Date().toISOString().split('T')[0],
                  paymentMode: selectedTxn.paymentMode || 'Consignment Account',
                  items: [
                    {
                      name: `Crackers Consignment: ${selectedTxn.notes || 'Batch Supply To Agent'}`,
                      sku: 'AG-CRK',
                      quantity: 1,
                      unit: 'consignment',
                      rate: Number(selectedTxn.givenProductAmount) || 0,
                      discount: 0,
                      taxable: Number(selectedTxn.givenProductAmount) || 0,
                      gstRate: 0,
                      total: Number(selectedTxn.givenProductAmount) || 0
                    }
                  ],
                  subtotal: Number(selectedTxn.givenProductAmount) || 0,
                  taxAmount: 0,
                  finalAmount: Number(selectedTxn.givenProductAmount) || 0,
                  notes: selectedTxn.notes || 'Goods dispatched to agent on commission/consignment terms.'
                }
              : {
                  id: `AG-RCPT-${(selectedTxn._id || '001').slice(-6).toUpperCase()}`,
                  agentName: selectedTxn.agentName || (selectedAgent && selectedAgent.name) || 'Agent',
                  agentPhone: selectedTxn.agentPhone || (selectedAgent && selectedAgent.phone) || '',
                  date: selectedTxn.date ? selectedTxn.date.split('T')[0] : new Date().toISOString().split('T')[0],
                  paymentMode: selectedTxn.paymentMode || 'Cash',
                  amount: Number(selectedTxn.receivedAmount) || 0,
                  subtotal: Number(selectedTxn.receivedAmount) || 0,
                  finalAmount: Number(selectedTxn.receivedAmount) || 0,
                  notes: selectedTxn.notes || 'Amount received towards agent ledger clearance.',
                  items: [
                    {
                      name: `Agent Payment Received (${selectedTxn.paymentMode || 'Cash'})`,
                      sku: 'AG-PMT',
                      quantity: 1,
                      unit: 'receipt',
                      rate: Number(selectedTxn.receivedAmount) || 0,
                      discount: 0,
                      taxable: Number(selectedTxn.receivedAmount) || 0,
                      gstRate: 0,
                      total: Number(selectedTxn.receivedAmount) || 0
                    }
                  ]
                }
          }
        />
      )}
    </div>
  );
};
