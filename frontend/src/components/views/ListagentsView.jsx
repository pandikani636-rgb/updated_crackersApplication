import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  Users,
  Search,
  Plus,
  Phone,
  FileText,
  Package,
  Printer,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  RefreshCw,
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pagination } from '../common/Pagination';


// Silent Printable Report Handler
const handlePrintReport = (records) => {
  const generatedAt = new Date().toLocaleString();

  const rows = records
    .map(
      (agent, index) => `
    <tr style="background:${index % 2 === 0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
      <td style="padding:10px 12px; font-weight:700; color:#f97316;">${index + 1}</td>
      <td style="padding:10px 12px; font-weight:600; color:#0f172a;">${agent.name}</td>
      <td style="padding:10px 12px; font-weight:600; color:#334155;">${agent.phone || '-'}</td>
      <td style="padding:10px 12px; font-family:monospace; color:#475569;">${agent.gst || 'N/A'}</td>
      <td style="padding:10px 12px; color:#475569;">${agent.items || '-'}</td>
      <td style="padding:10px 12px; font-weight:600; color:#16a34a;">${agent.status || 'Active'}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Agents Master List Report</title>
      <meta charset="UTF-8"/>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; color:#1e293b; padding:40px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div style="border-bottom:3px solid #f97316; padding-bottom:16px; margin-bottom:24px;">
        <h1 style="font-size:22px; font-weight:900; color:#f97316;">Agents Master Directory Report</h1>
        <p style="margin:4px 0 0; font-size:12px; color:#64748b;">Generated: ${generatedAt} | Total Agents: ${records.length}</p>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f97316; color:white; text-align:left;">
            <th style="padding:10px 12px;">S.No</th>
            <th style="padding:10px 12px;">Agent Name</th>
            <th style="padding:10px 12px;">Phone Number</th>
            <th style="padding:10px 12px;">GST Number</th>
            <th style="padding:10px 12px;">Assigned Items</th>
            <th style="padding:10px 12px;">Status</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <p style="margin-top:32px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:12px;">
        CrackerHub CRM — Agents Directory Report
      </p>
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
    }, 1000);
  }, 300);
};

// CSV Export Handler
const handleExportCSV = (records) => {
  if (!records || records.length === 0) return;

  const headers = ['S.No', 'Agent Name', 'Phone Number', 'GST Number', 'Assigned Items', 'Status'];
  const rows = records.map((agent, index) => [
    index + 1,
    `"${(agent.name || '').replace(/"/g, '""')}"`,
    `"${(agent.phone || '').replace(/"/g, '""')}"`,
    `"${(agent.gst || '').replace(/"/g, '""')}"`,
    `"${(agent.items || '').replace(/"/g, '""')}"`,
    `"${(agent.status || 'Active').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Agents_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ListagentsView = () => {
  const { showToast, setCurrentTab } = useApp();

  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal State
  const [editingAgent, setEditingAgent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    gst: '',
    items: '',
    status: 'Active'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/agents`);
      // Sort descending (latest added first)
      setAgents([...res.data].reverse());
    } catch (err) {
      if (showToast) showToast('Failed to load agents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      await axios.delete(`${API_URL}/agents/${id}`);
      if (showToast) showToast('Agent removed successfully', 'success');
      fetchAgents();
    } catch (err) {
      if (showToast) showToast('Failed to delete agent', 'error');
    }
  };

  const handleEditOpen = (agent) => {
    setEditingAgent(agent);
    setEditFormData({
      name: agent.name || '',
      phone: agent.phone || '',
      gst: agent.gst || '',
      items: agent.items || '',
      status: agent.status || 'Active'
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingAgent) return;

    setIsUpdating(true);
    try {
      await axios.put(`${API_URL}/agents/${editingAgent._id}`, editFormData);
      if (showToast) showToast('Agent updated successfully!', 'success');
      setEditingAgent(null);
      fetchAgents();
    } catch (err) {
      if (showToast) showToast('Failed to update agent', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAgents = agents.filter((a) => {
    const matchesSearch =
      (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.gst || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.items || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? a.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  // Auto-adjust page if current page exceeds total pages after deletion
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredAgents.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => (a.status || 'Active') === 'Active').length;
  const gstRegistered = agents.filter((a) => a.gst && a.gst.trim().length > 0).length;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Users className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Agents Master List
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive list of all agents, contact details, GST registration & assigned products.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV(filteredAgents)}
            disabled={filteredAgents.length === 0}
            className="px-3.5 py-2.5 bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            title="Export CSV Report"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>

          <button
            onClick={() => handlePrintReport(filteredAgents)}
            disabled={filteredAgents.length === 0}
            className="px-3.5 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-sm disabled:opacity-50"
            title="Print Report"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Print
          </button>

          <button
            onClick={() => setCurrentTab('Addagents')}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Agent
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Registered Agents</p>
            <p className="text-2xl font-black text-white mt-1">{totalAgents}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Agents</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeAgents}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">GST Registered</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{gstRegistered}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by agent name, phone, GST or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full md:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <button
            onClick={fetchAgents}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl transition-all"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Agents Table List */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <p className="text-xs font-semibold">Loading agent database records...</p>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <Users className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-base font-bold text-slate-300">No agents found</p>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or add a new agent.
            </p>
            <button
              onClick={() => setCurrentTab('Addagents')}
              className="mt-2 px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold text-xs rounded-xl hover:bg-orange-500/20 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Agent Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                  <th className="py-4 px-6">S.No</th>
                  <th className="py-4 px-6">Agent Details</th>
                  <th className="py-4 px-6">Phone Number</th>
                  <th className="py-4 px-6">GST Number</th>
                  <th className="py-4 px-6">Assigned Items</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {paginatedAgents.map((agent, index) => (
                  <tr key={agent._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-orange-400">{startIndex + index + 1}</td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400 font-black text-sm flex items-center justify-center shrink-0">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100 text-sm">{agent.name}</p>
                          {/* <p className="text-[10px] text-slate-400 mt-0.5">Agent ID: #{agent._id.slice(-6)}</p> */}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {agent.phone || '-'}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-xs uppercase tracking-wider text-slate-300">
                      {agent.gst ? (
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {agent.gst}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Not Provided</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {agent.items ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {agent.items.split(',').map((it, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[11px] font-medium"
                            >
                              {it.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">None</span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          (agent.status || 'Active') === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" /> {agent.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEditOpen(agent)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                          title="Edit Agent"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Agent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Component */}
            <div className="p-4 border-t border-slate-800/80">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredAgents.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </div>
        )}
      </div>

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-400" /> Edit Agent Details
              </h3>
              <button
                onClick={() => setEditingAgent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Agent Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">GST Number</label>
                <input
                  type="text"
                  value={editFormData.gst}
                  onChange={(e) => setEditFormData({ ...editFormData, gst: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assigned Items / Products</label>
                <input
                  type="text"
                  value={editFormData.items}
                  onChange={(e) => setEditFormData({ ...editFormData, items: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
