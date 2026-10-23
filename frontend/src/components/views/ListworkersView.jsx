import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  Building,
  Coins,
  Layers,
  Sparkles,
  Warehouse,
  Search,
  RefreshCw,
  Loader2,
  ClipboardList,
  Trash2,
  Pencil,
  Printer,
  CalendarRange,
  Calendar,
  Save,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Pagination } from '../common/Pagination';


const getRecordTotal = (record) => {
  if (record.office !== undefined || record.money !== undefined || record.set !== undefined || record.finishing !== undefined || record.godown !== undefined) {
    return (Number(record.office) || 0) +
           (Number(record.money) || 0) +
           (Number(record.set) || 0) +
           (Number(record.finishing) || 0) +
           (Number(record.godown) || 0);
  }
  return Number(record.count) || 0;
};

// ─── Print Report (Silent Iframe Print - No Extra Tab/Window) ───────────
const handlePrintReport = (records, fromDate, toDate) => {
  const grandTotal = records.reduce((s, r) => s + getRecordTotal(r), 0);
  const generatedAt = new Date().toLocaleString();
  const periodLabel = (fromDate || toDate)
    ? `${fromDate || 'Start'} to ${toDate || 'End'}`
    : 'All Dates';

  const rows = records.map((record, index) => {
    const total = getRecordTotal(record);
    const office = record.office || (record.department === 'Office' ? record.count : 0);
    const money = record.money || (record.department === 'Money' ? record.count : 0);
    const setVal = record.set || (record.department === 'Set' ? record.count : 0);
    const finishing = record.finishing || (record.department === 'Finishing' ? record.count : 0);
    const godown = record.godown || (record.department === 'Godown' ? record.count : 0);

    return `
      <tr style="background:${index % 2 === 0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
        <td style="padding:9px 12px; font-weight:700; color:#f97316;">${index + 1}</td>
        <td style="padding:9px 12px; font-family:monospace; color:#1e293b; font-weight:600;">${record.date}</td>
        <td style="padding:9px 12px; text-align:center;">${office}</td>
        <td style="padding:9px 12px; text-align:center;">${money}</td>
        <td style="padding:9px 12px; text-align:center;">${setVal}</td>
        <td style="padding:9px 12px; text-align:center;">${finishing}</td>
        <td style="padding:9px 12px; text-align:center;">${godown}</td>
        <td style="padding:9px 12px; text-align:center; font-weight:700; color:#f97316;">${total} Staff</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Worker Allocation Report</title>
      <meta charset="UTF-8"/>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; color:#1e293b; padding:40px; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div style="border-bottom:3px solid #f97316; padding-bottom:16px; margin-bottom:24px;">
        <h1 style="font-size:22px; font-weight:900; color:#f97316;">Worker Allocation Report</h1>
        <p style="margin:6px 0 0; font-size:13px; color:#64748b;">Period: <strong>${periodLabel}</strong></p>
        <p style="margin:3px 0 0; font-size:11px; color:#94a3b8;">Generated: ${generatedAt}</p>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f97316; color:white;">
            <th style="padding:10px 12px; text-align:left;">No.</th>
            <th style="padding:10px 12px; text-align:left;">Date</th>
            <th style="padding:10px 12px; text-align:center;">Office</th>
            <th style="padding:10px 12px; text-align:center;">Money</th>
            <th style="padding:10px 12px; text-align:center;">Set</th>
            <th style="padding:10px 12px; text-align:center;">Finishing</th>
            <th style="padding:10px 12px; text-align:center;">Godown</th>
            <th style="padding:10px 12px; text-align:center;">Total Staff</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr style="background:#fff7ed; font-weight:900; border-top:2px solid #fed7aa;">
            <td colspan="7" style="padding:10px 12px; color:#9a3412; text-transform:uppercase; font-size:12px;">Grand Total</td>
            <td style="padding:10px 12px; text-align:center; color:#f97316; font-size:16px;">${grandTotal} Staff</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin-top:32px; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:12px;">
        Worker Allocation Report — ${generatedAt}
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
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 250);
};

// ─── Export CSV Handler ──────────────────────────────────────────────────
const handleExportCSV = (records) => {
  if (!records || records.length === 0) return;

  const headers = ['S.No', 'Date', 'Office', 'Money', 'Set', 'Finishing', 'Godown', 'Total Staff'];
  const rows = records.map((record, index) => {
    const total = getRecordTotal(record);
    const office = record.office !== undefined ? record.office : (record.department === 'Office' ? record.count : 0);
    const money = record.money !== undefined ? record.money : (record.department === 'Money' ? record.count : 0);
    const setVal = record.set !== undefined ? record.set : (record.department === 'Set' ? record.count : 0);
    const finishing = record.finishing !== undefined ? record.finishing : (record.department === 'Finishing' ? record.count : 0);
    const godown = record.godown !== undefined ? record.godown : (record.department === 'Godown' ? record.count : 0);

    return [
      index + 1,
      `"${record.date || ''}"`,
      office,
      money,
      setVal,
      finishing,
      godown,
      total
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Worker_Allocations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const ListworkersView = () => {
  const { showToast, theme } = useApp();
  const [allocations, setAllocations] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [search, setSearch]           = useState('');
  const [fromDate, setFromDate]       = useState('');
  const [toDate, setToDate]           = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editDate, setEditDate]           = useState('');
  const [editOffice, setEditOffice]       = useState(0);
  const [editMoney, setEditMoney]         = useState(0);
  const [editSet, setEditSet]             = useState(0);
  const [editFinishing, setEditFinishing] = useState(0);
  const [editGodown, setEditGodown]       = useState(0);
  const [isUpdating, setIsUpdating]       = useState(false);

  const fromDateRef = useRef(null);
  const toDateRef   = useRef(null);
  const editDateRef = useRef(null);

  useEffect(() => { fetchAllocations(); }, []);

  const fetchAllocations = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/workerAllocations`);
      // Sort descending (newest date and newly added first)
      const sorted = [...res.data].sort((a, b) => {
        if (a.date && b.date && a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setAllocations(sorted);
    } catch { /* silent */ }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/workerAllocations/${id}`);
      setAllocations((prev) => prev.filter((r) => r._id !== id));
      if (showToast) showToast('Record deleted successfully', 'info');
    } catch { /* silent */ }
  };

  const startEditing = (record) => {
    setEditingRecord(record);
    setEditDate(record.date || '');
    setEditOffice(record.office || (record.department === 'Office' ? record.count : 0));
    setEditMoney(record.money || (record.department === 'Money' ? record.count : 0));
    setEditSet(record.set || (record.department === 'Set' ? record.count : 0));
    setEditFinishing(record.finishing || (record.department === 'Finishing' ? record.count : 0));
    setEditGodown(record.godown || (record.department === 'Godown' ? record.count : 0));
  };

  const handleUpdate = async () => {
    if (!editingRecord) return;
    const targetId = editingRecord._id || editingRecord.id;
    if (!targetId) return;

    setIsUpdating(true);
    try {
      const res = await axios.put(`${API_URL}/workerAllocations/${targetId}`, {
        date: editDate,
        office: Number(editOffice) || 0,
        money: Number(editMoney) || 0,
        set: Number(editSet) || 0,
        finishing: Number(editFinishing) || 0,
        godown: Number(editGodown) || 0
      });

      if (res.data) {
        setAllocations((prev) =>
          prev.map((item) =>
            ((item._id && res.data._id && item._id === res.data._id) ||
             (item.id && res.data.id && item.id === res.data.id))
              ? res.data
              : item
          )
        );
        fetchAllocations();
        if (showToast) showToast('Worker allocation updated successfully!', 'success');
        setEditingRecord(null);
      }
    } catch (err) {
      if (showToast) showToast('Failed to update allocation', 'error');
    }
    setIsUpdating(false);
  };

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
  };

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, fromDate, toDate]);

  // Search + date range filter (sorted descending: latest first)
  const filtered = allocations
    .filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = (item.date || '').includes(q) || (item.department || '').toLowerCase().includes(q);
      const itemDate  = item.date || '';
      const matchFrom = fromDate ? itemDate >= fromDate : true;
      const matchTo   = toDate   ? itemDate <= toDate   : true;
      return matchSearch && matchFrom && matchTo;
    })
    .sort((a, b) => {
      if (a.date && b.date && a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Auto-adjust page if current page exceeds total pages after deletion
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filtered.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filtered.slice(startIndex, startIndex + itemsPerPage);

  const totalStaff  = filtered.reduce((s, r) => s + getRecordTotal(r), 0);
  const hasFilters  = search || fromDate || toDate;

  const openPicker = (ref) => {
    try {
      if (ref.current && typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current?.focus();
      }
    } catch (e) {
      ref.current?.focus();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20">
            <ClipboardList className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Worker Allocations List</h2>
            <p className="text-xs text-slate-400 mt-0.5">Date-wise Office, Money, Set, Finishing & Godown worker allocations.</p>
          </div>
        </div>
        <button
          onClick={fetchAllocations}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 hover:bg-slate-800 text-slate-400 hover:text-orange-400 transition-all"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 p-4">
          
          {/* Left Controls (Search & Date Pickers) */}
          <div className="flex flex-wrap items-end gap-3 w-full lg:w-auto">

            {/* Search */}
            <div className="flex flex-col gap-1 w-full sm:w-auto sm:min-w-[220px] flex-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Search</span>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search date..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="hidden sm:block h-9 w-px bg-slate-800/80 self-end mb-0.5" />

            {/* From Date */}
            <div className="flex flex-col gap-1 flex-1 sm:flex-initial">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                From Date
              </span>
              <div className="relative flex items-center">
                <input
                  ref={fromDateRef}
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  onClick={() => openPicker(fromDateRef)}
                  style={{
                    colorScheme: theme === 'dark' ? 'dark' : 'light',
                    backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                  }}
                  className="w-full pl-3 pr-4 py-2 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1 flex-1 sm:flex-initial">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                To Date
              </span>
              <div className="relative flex items-center">
                <input
                  ref={toDateRef}
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  onClick={() => openPicker(toDateRef)}
                  style={{
                    colorScheme: theme === 'dark' ? 'dark' : 'light',
                    backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                  }}
                  className="w-full pl-3 pr-4 py-2 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all self-end"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Right Controls (Export CSV & Print Report) */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start sm:justify-end border-t lg:border-t-0 border-slate-800/80 pt-3 lg:pt-0">

            {/* CSV Export */}
            <button
              onClick={() => handleExportCSV(filtered)}
              disabled={filtered.length === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filtered.length > 0
                  ? 'bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 cursor-pointer shadow-md'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
              }`}
              title="Export CSV Report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>

            {/* Print Report */}
            <button
              onClick={() => handlePrintReport(filtered, fromDate, toDate)}
              disabled={filtered.length === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filtered.length > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-md shadow-orange-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              Print Report
            </button>
          </div>
        </div>

        {/* Active date-range info bar */}
        {(fromDate || toDate) && (
          <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl">
            <CalendarRange className="w-3.5 h-3.5 shrink-0" />
            Showing records from{' '}
            <span className="font-bold font-mono">{fromDate || '—'}</span>
            {' '}to{' '}
            <span className="font-bold font-mono">{toDate || '—'}</span>
            {' '}—{' '}
            <span className="font-black">{filtered.length} records, {totalStaff} Staff</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-14 whitespace-nowrap">No.</th>
                <th className="p-3.5 min-w-[110px] whitespace-nowrap">Date</th>
                <th className="p-3.5 min-w-[80px] text-center whitespace-nowrap">Office</th>
                <th className="p-3.5 min-w-[80px] text-center whitespace-nowrap">Money</th>
                <th className="p-3.5 min-w-[80px] text-center whitespace-nowrap">Set</th>
                <th className="p-3.5 min-w-[80px] text-center whitespace-nowrap">Finishing</th>
                <th className="p-3.5 min-w-[80px] text-center whitespace-nowrap">Godown</th>
                <th className="p-3.5 min-w-[120px] text-center whitespace-nowrap">Total Staff</th>
                <th className="p-3.5 min-w-[100px] text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-orange-400" />
                    <p className="text-slate-500 text-xs mt-2">Loading from database...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 italic">
                    {hasFilters
                      ? 'No records match the selected filters.'
                      : 'No allocations saved yet. Go to Add Workers to create one.'}
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => {
                  const total = getRecordTotal(record);
                  const officeVal = record.office !== undefined ? record.office : (record.department === 'Office' ? record.count : 0);
                  const moneyVal = record.money !== undefined ? record.money : (record.department === 'Money' ? record.count : 0);
                  const setVal = record.set !== undefined ? record.set : (record.department === 'Set' ? record.count : 0);
                  const finishingVal = record.finishing !== undefined ? record.finishing : (record.department === 'Finishing' ? record.count : 0);
                  const godownVal = record.godown !== undefined ? record.godown : (record.department === 'Godown' ? record.count : 0);

                  return (
                    <tr key={record._id} className="hover:bg-slate-800/40 transition-colors">

                      {/* No. */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="w-7 h-7 flex items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 dark:text-orange-400 font-black font-mono text-xs">
                          {startIndex + index + 1}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 font-mono font-bold whitespace-nowrap">{record.date}</td>

                      {/* Office */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 font-bold font-mono text-xs">
                          {officeVal}
                        </span>
                      </td>

                      {/* Money */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 font-bold font-mono text-xs">
                          {moneyVal}
                        </span>
                      </td>

                      {/* Set */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 font-bold font-mono text-xs">
                          {setVal}
                        </span>
                      </td>

                      {/* Finishing */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 font-bold font-mono text-xs">
                          {finishingVal}
                        </span>
                      </td>

                      {/* Godown */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 font-bold font-mono text-xs">
                          {godownVal}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-orange-500/15 text-orange-500 dark:text-orange-400 font-black font-mono text-xs rounded-xl border border-orange-500/20 whitespace-nowrap">
                          {total} staff
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => startEditing(record)}
                            className="p-1.5 rounded-lg cursor-pointer hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 transition-colors"
                            title="Edit Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(record._id)}
                            className="p-1.5 rounded-lg cursor-pointer hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom total bar & Pagination */}
        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {filtered.length} record{filtered.length !== 1 ? 's' : ''}
                {hasFilters && <span className="text-orange-400 ml-1">(filtered)</span>}
              </span>
              <span className="text-sm font-black text-emerald-400 font-mono">
                Total: {totalStaff} Workers
              </span>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* ─── Edit Modal ──────────────────────────────────────────────────────── */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Edit Worker Allocation</h3>
                  <p className="text-xs text-slate-400">Update worker count per department</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Fields */}
            <div className="space-y-3">

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-slate-400 font-semibold uppercase">Allocation Date</label>
                <div className="relative flex items-center">
                  <input
                    ref={editDateRef}
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    onClick={() => openPicker(editDateRef)}
                    style={{
                      colorScheme: theme === 'dark' ? 'dark' : 'light',
                      backgroundColor: theme === 'dark' ? '#020617' : '#ffffff'
                    }}
                    className="w-full pl-3.5 pr-9 py-2 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                  />
                  <Calendar
                    onClick={() => openPicker(editDateRef)}
                    className="w-4 h-4 text-slate-400 hover:text-orange-400 absolute right-3 cursor-pointer z-10"
                  />
                </div>
              </div>

              {/* Department Counts */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-blue-400 font-semibold uppercase flex items-center gap-1">
                    <Building className="w-3 h-3" /> Office
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editOffice}
                    onChange={(e) => setEditOffice(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                    <Coins className="w-3 h-3" /> Money
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editMoney}
                    onChange={(e) => setEditMoney(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Set
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editSet}
                    onChange={(e) => setEditSet(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-purple-400 font-semibold uppercase flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Finishing
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFinishing}
                    onChange={(e) => setEditFinishing(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] text-rose-400 font-semibold uppercase flex items-center gap-1">
                    <Warehouse className="w-3 h-3" /> Godown
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editGodown}
                    onChange={(e) => setEditGodown(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};