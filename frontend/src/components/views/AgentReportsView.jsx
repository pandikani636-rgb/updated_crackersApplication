import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  User,
  Eye,
  Printer,
  Sparkles,
  TrendingUp,
  TrendingDown,
  CreditCard,
  FileText,
  Loader2,
  RefreshCw,
  Wallet,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';
import { exportDocxReport } from '../../utils/exportDocx';

export const AgentReportsView = () => {
  const { showToast, setCurrentTab } = useApp();

  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('all');

  // Date ranges: Default from beginning of current month to today
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);

  const [transactions, setTransactions] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [selectedAgentId, fromDate, toDate]);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(`${API_URL}/agents`);
      setAgents(res.data);
    } catch (err) {
      if (showToast) showToast('Failed to load agents list', 'error');
    }
  };

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedAgentId && selectedAgentId !== 'all') {
        params.agentId = selectedAgentId;
      }
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await axios.get(`${API_URL}/agent-accounts`, { params });
      setTransactions(res.data);
    } catch (err) {
      if (showToast) showToast('Failed to load report records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Computations
  const totalGiven = transactions.reduce((acc, curr) => acc + (Number(curr.givenProductAmount) || 0), 0);
  const totalReceived = transactions.reduce((acc, curr) => acc + (Number(curr.receivedAmount) || 0), 0);
  const netBalance = totalGiven - totalReceived;

  const getAgentLabel = () => {
    if (selectedAgentId === 'all') return 'All Agents';
    const found = agents.find((a) => a._id === selectedAgentId);
    return found ? found.name : 'Selected Agent';
  };

  // Export to Excel (CSV with UTF-8 BOM for Excel compatibility)
  const handleExportExcel = () => {
    if (transactions.length === 0) {
      if (showToast) showToast('No transaction data to export', 'error');
      return;
    }

    setIsExporting('excel');

    try {
      const headers = ['S.No', 'Date', 'Agent Name', 'Agent Phone', 'Product Amount Given (Rs)', 'Amount Received (Rs)', 'Balance (Rs)', 'Payment Mode', 'Notes'];
      const csvRows = [headers.join(',')];

      transactions.forEach((txn, index) => {
        const row = [
          index + 1,
          `"${new Date(txn.date).toLocaleDateString('en-IN')}"`,
          `"${txn.agentName.replace(/"/g, '""')}"`,
          `"${txn.agentPhone || ''}"`,
          txn.givenProductAmount || 0,
          txn.receivedAmount || 0,
          txn.balanceAfter || 0,
          `"${(txn.paymentMode || 'Cash').replace(/"/g, '""')}"`,
          `"${(txn.notes || '').replace(/"/g, '""')}"`
        ];
        csvRows.push(row.join(','));
      });

      // Summary row
      csvRows.push('');
      csvRows.push(`"","TOTALS","","","${totalGiven}","${totalReceived}","${netBalance}","",""`);

      const csvString = '\uFEFF' + csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Agent_Accounts_Report_${getAgentLabel().replace(/\s+/g, '_')}_${fromDate}_to_${toDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (showToast) showToast('Excel/CSV report exported successfully!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to export Excel file', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  // Export to Word (.docx)
  const handleExportWord = () => {
    if (transactions.length === 0) {
      if (showToast) showToast('No transaction data to export', 'error');
      return;
    }
    const columns = [
      { header: 'S.No', key: 'sno' },
      { header: 'Date', key: 'date' },
      { header: 'Agent Name', key: 'agentName' },
      { header: 'Phone', key: 'agentPhone' },
      { header: 'Product Amount Given (Rs)', key: 'given' },
      { header: 'Amount Received (Rs)', key: 'received' },
      { header: 'Running Balance (Rs)', key: 'balance' },
      { header: 'Mode', key: 'mode' },
      { header: 'Notes', key: 'notes' }
    ];
    const data = transactions.map((t, idx) => ({
      sno: idx + 1,
      date: new Date(t.date).toLocaleDateString('en-IN'),
      agentName: t.agentName,
      agentPhone: t.agentPhone || '-',
      given: t.givenProductAmount > 0 ? `Rs. ${Number(t.givenProductAmount).toLocaleString('en-IN')}` : '-',
      received: t.receivedAmount > 0 ? `Rs. ${Number(t.receivedAmount).toLocaleString('en-IN')}` : '-',
      balance: `Rs. ${Number(t.balanceAfter || 0).toLocaleString('en-IN')}`,
      mode: t.paymentMode || 'Cash',
      notes: t.notes || '-'
    }));
    exportDocxReport({
      title: `Agent Accounts Ledger Statement - ${getAgentLabel()}`,
      subtitle: `Period: ${fromDate} to ${toDate} | Total Given: Rs. ${totalGiven.toLocaleString('en-IN')} | Total Received: Rs. ${totalReceived.toLocaleString('en-IN')} | Net Balance: Rs. ${netBalance.toLocaleString('en-IN')}`,
      columns,
      data,
      filename: `Agent_Accounts_Report_${getAgentLabel().replace(/\s+/g, '_')}_${fromDate}_to_${toDate}.docx`
    });
    if (showToast) showToast('Word document (.docx) exported successfully!', 'success');
  };

  // Export to PDF / Print Report
  const handleExportPDF = () => {
    if (transactions.length === 0) {
      if (showToast) showToast('No transaction data to export', 'error');
      return;
    }

    setIsExporting('pdf');

    const generatedAt = new Date().toLocaleString('en-IN');
    const agentNameText = getAgentLabel();

    const rows = transactions
      .map(
        (txn, index) => `
      <tr style="background:${index % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
        <td style="padding:8px 10px; font-weight:bold; color:#ea580c; text-align:center;">${index + 1}</td>
        <td style="padding:8px 10px; font-family:monospace; color:#334155;">${new Date(txn.date).toLocaleDateString('en-IN')}</td>
        <td style="padding:8px 10px; font-weight:600; color:#0f172a;">${txn.agentName} ${txn.agentPhone ? `<span style="font-size:11px; color:#64748b;">(${txn.agentPhone})</span>` : ''}</td>
        <td style="padding:8px 10px; text-align:right; font-weight:bold; color:#d97706; font-family:monospace;">${txn.givenProductAmount > 0 ? '₹' + Number(txn.givenProductAmount).toLocaleString('en-IN') : '-'}</td>
        <td style="padding:8px 10px; text-align:right; font-weight:bold; color:#16a34a; font-family:monospace;">${txn.receivedAmount > 0 ? '₹' + Number(txn.receivedAmount).toLocaleString('en-IN') : '-'}</td>
        <td style="padding:8px 10px; text-align:right; font-weight:900; color:#ea580c; font-family:monospace;">₹${Number(txn.balanceAfter || 0).toLocaleString('en-IN')}</td>
        <td style="padding:8px 10px; font-size:11px; color:#475569;">${txn.paymentMode || 'Cash'}</td>
        <td style="padding:8px 10px; font-size:11px; color:#64748b; font-style:italic;">${txn.notes || '-'}</td>
      </tr>
    `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Agent Accounts Report - ${agentNameText}</title>
        <meta charset="UTF-8"/>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color:#1e293b; padding:35px; }
          @media print { body { padding: 15px; } }
          .summary-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px 16px; min-width:180px; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="border-bottom:3px solid #f97316; padding-bottom:15px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h1 style="font-size:24px; font-weight:900; color:#ea580c; letter-spacing:0.5px;">Cracker<span style="color:#0f172a;">Hub</span> CRM & Factory ERP</h1>
            <h2 style="font-size:16px; font-weight:700; color:#334155; margin-top:4px;">Agent Accounts Statement & Audit Report</h2>
            <p style="font-size:12px; color:#64748b; margin-top:2px;">Agent Scope: <strong>${agentNameText}</strong> | Period: <strong>${fromDate}</strong> to <strong>${toDate}</strong></p>
          </div>
          <div style="text-align:right; font-size:11px; color:#64748b;">
            <p>Generated: <strong>${generatedAt}</strong></p>
            <p>Total Records: <strong>${transactions.length}</strong></p>
          </div>
        </div>

        <!-- Metric Summary -->
        <div style="display:flex; gap:15px; margin-bottom:25px;">
          <div class="summary-card">
            <p style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:600;">Total Product Given</p>
            <p style="font-size:18px; font-weight:900; color:#d97706; margin-top:4px;">₹${totalGiven.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-card">
            <p style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:600;">Total Amount Received</p>
            <p style="font-size:18px; font-weight:900; color:#16a34a; margin-top:4px;">₹${totalReceived.toLocaleString('en-IN')}</p>
          </div>
          <div class="summary-card" style="border-color:#f97316; background:#fff7ed;">
            <p style="font-size:11px; color:#ea580c; text-transform:uppercase; font-weight:700;">Net Balance Outstanding</p>
            <p style="font-size:18px; font-weight:900; color:#ea580c; margin-top:4px;">₹${netBalance.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <!-- Data Table -->
        <table style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="background:#ea580c; color:white; text-align:left;">
              <th style="padding:10px; text-align:center;">S.No</th>
              <th style="padding:10px;">Date</th>
              <th style="padding:10px;">Agent Details</th>
              <th style="padding:10px; text-align:right;">Product Given (₹)</th>
              <th style="padding:10px; text-align:right;">Amount Received (₹)</th>
              <th style="padding:10px; text-align:right;">Balance (₹)</th>
              <th style="padding:10px;">Mode</th>
              <th style="padding:10px;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr style="background:#0f172a; color:white; font-weight:bold; border-top:2px solid #ea580c;">
              <td colspan="3" style="padding:10px 12px; text-align:right;">TOTALS FOR SELECTED PERIOD:</td>
              <td style="padding:10px 12px; text-align:right; color:#fde68a; font-family:monospace; font-size:13px;">₹${totalGiven.toLocaleString('en-IN')}</td>
              <td style="padding:10px 12px; text-align:right; color:#86efac; font-family:monospace; font-size:13px;">₹${totalReceived.toLocaleString('en-IN')}</td>
              <td style="padding:10px 12px; text-align:right; color:#fed7aa; font-family:monospace; font-size:13px;">₹${netBalance.toLocaleString('en-IN')}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>

        <!-- Footer -->
        <div style="margin-top:35px; border-top:1px solid #e2e8f0; padding-top:12px; font-size:11px; color:#94a3b8; display:flex; justify-content:space-between;">
          <p>CrackerHub ERP — Certified Accounting Statement</p>
          <p>Confidential & Proprietary</p>
        </div>
      </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        setIsExporting(null);
      }, 1000);
    }, 400);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FileSpreadsheet className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Agent Accounts Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate date-range filtered statement audits, view paid/given balances, and export in Excel & PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            disabled={isExporting === 'excel' || transactions.length === 0}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            {isExporting === 'excel' ? 'Exporting...' : 'Download Excel'}
          </button>

          <button
            onClick={handleExportWord}
            disabled={transactions.length === 0}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            Export Word (.docx)
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExporting === 'pdf' || transactions.length === 0}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Printer className="w-4 h-4 stroke-[3]" />
            {isExporting === 'pdf' ? 'Preparing PDF...' : 'Download PDF / Print'}
          </button>

          <button
            onClick={() => setCurrentTab('AgentAccounts')}
            className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
          >
            <Wallet className="w-4 h-4 text-orange-400" /> Account Entry
          </button>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-orange-400" /> Filter Criteria & Report Generator
          </h3>
          <span className="text-[11px] text-slate-400">
            Scope: <strong className="text-orange-400">{getAgentLabel()}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* From Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Agent Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" /> Select Agent (Dropdown)
            </label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">★ All Agents (Consolidated Report)</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} {a.phone ? `(${a.phone})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500 font-mono">
            Showing records between {fromDate} and {toDate}
          </span>

          <button
            onClick={fetchReportData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-400" /> Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Total Entries</p>
            <p className="text-2xl font-black text-white mt-1">{transactions.length} Records</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Product Given (Debit)</p>
            <p className="text-2xl font-black text-amber-400 mt-1">₹{totalGiven.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Amount Received (Credit)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">₹{totalReceived.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase">Period Net Balance</p>
            <p className="text-2xl font-black text-orange-400 mt-1">₹{netBalance.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-400" /> Statement Audit Table ({transactions.length} entries)
          </h4>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              disabled={transactions.length === 0}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
            <button
              onClick={handleExportPDF}
              disabled={transactions.length === 0}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <p className="text-xs font-semibold">Generating report statement...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-base font-bold text-slate-300">No records found for the selected period</p>
            <p className="text-xs text-slate-500">
              Try adjusting the From Date / To Date range or select a different agent.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60 font-semibold">
                  <th className="py-3.5 px-5">S.No</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Agent Details</th>
                  <th className="py-3.5 px-5 text-right">Crackers Product Amount (Given)</th>
                  <th className="py-3.5 px-5 text-right">Amount Received (Paid)</th>
                  <th className="py-3.5 px-5 text-right">Balance</th>
                  <th className="py-3.5 px-5">Mode</th>
                  <th className="py-3.5 px-5">Notes</th>
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

                    <td className="py-3.5 px-5 text-right font-bold text-amber-400 font-mono">
                      {txn.givenProductAmount > 0 ? `₹${Number(txn.givenProductAmount).toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-emerald-400 font-mono">
                      {txn.receivedAmount > 0 ? `₹${Number(txn.receivedAmount).toLocaleString('en-IN')}` : '-'}
                    </td>

                    <td className="py-3.5 px-5 text-right font-black text-orange-400 font-mono">
                      ₹{Number(txn.balanceAfter || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300 border border-slate-700">
                        {txn.paymentMode || 'Cash'}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-400 italic max-w-xs truncate">
                      {txn.notes || '-'}
                    </td>

                    <td className="py-3.5 px-5 text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-950 font-bold text-slate-200">
                  <td colSpan={3} className="py-4 px-5 text-right uppercase text-[11px] tracking-wider text-slate-400">
                    Totals for Selected Period:
                  </td>
                  <td className="py-4 px-5 text-right text-amber-400 font-mono text-sm">
                    ₹{totalGiven.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-5 text-right text-emerald-400 font-mono text-sm">
                    ₹{totalReceived.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-5 text-right text-orange-400 font-mono text-sm">
                    ₹{netBalance.toLocaleString('en-IN')}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
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
                  agentName: selectedTxn.agentName || 'Agent',
                  agentPhone: selectedTxn.agentPhone || '',
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
                  agentName: selectedTxn.agentName || 'Agent',
                  agentPhone: selectedTxn.agentPhone || '',
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
