import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Eye,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  Users,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView = () => {
  const {
    imports,
    exportsList,
    stock,
    attendance,
    payroll,
    suppliers,
    crackers,
    workers,
    formatCurrency,
    showToast
  } = useApp();

  const todayDateStr = new Date().toISOString().split('T')[0];

  const [activeReportTab, setActiveReportTab] = useState('import'); // 'import' | 'export' | 'stock' | 'attendance' | 'salary'
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState(todayDateStr);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedCracker, setSelectedCracker] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isDownloading, setIsDownloading] = useState(null);

  const reportTabs = [
    { id: 'import', label: 'Import Report', icon: ArrowDownLeft, color: 'text-blue-400' },
    { id: 'export', label: 'Export Sales Report', icon: ArrowUpRight, color: 'text-emerald-400' },
    { id: 'stock', label: 'Inventory Stock Report', icon: Boxes, color: 'text-amber-400' },
    { id: 'attendance', label: 'Worker Attendance Report', icon: Users, color: 'text-purple-400' },
    { id: 'salary', label: 'Payroll & Salary Report', icon: CreditCard, color: 'text-rose-400' }
  ];

  const handleDownload = (type) => {
    setIsDownloading(type);
    showToast(`Generating ${type.toUpperCase()} file for ${activeReportTab} report...`, 'info');
    setTimeout(() => {
      setIsDownloading(null);
      showToast(`CrackerHub_${activeReportTab.toUpperCase()}_Report_August2026.${type === 'excel' ? 'xlsx' : 'pdf'} downloaded!`, 'success');
    }, 1500);
  };

  // Preview computations
  const getPreviewData = () => {
    if (activeReportTab === 'import') {
      const data = imports.filter(i => {
        const supMatch = selectedSupplier ? i.supplier === selectedSupplier : true;
        const crkMatch = selectedCracker ? i.cracker === selectedCracker : true;
        return supMatch && crkMatch;
      });
      const totalQuantity = data.reduce((acc, curr) => acc + curr.totalPackets, 0);
      const totalAmount = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
      return { data, totalRecords: data.length, totalQuantity, totalAmount, unit: 'Packets' };
    }

    if (activeReportTab === 'export') {
      const data = exportsList.filter(e => {
        const crkMatch = selectedCracker ? e.cracker === selectedCracker : true;
        return crkMatch;
      });
      const totalQuantity = data.reduce((acc, curr) => acc + curr.packets, 0);
      const totalAmount = data.reduce((acc, curr) => acc + curr.totalAmount, 0);
      return { data, totalRecords: data.length, totalQuantity, totalAmount, unit: 'Packets' };
    }

    if (activeReportTab === 'stock') {
      const data = stock.filter(s => selectedCracker ? s.cracker === selectedCracker : true);
      const totalQuantity = data.reduce((acc, curr) => acc + curr.availablePackets, 0);
      const totalAmount = data.reduce((acc, curr) => acc + (curr.availableBundles * 4500), 0);
      return { data, totalRecords: data.length, totalQuantity, totalAmount, unit: 'Packets in Warehouse' };
    }

    if (activeReportTab === 'attendance') {
      const data = attendance.filter(a => selectedWorker ? a.empId === selectedWorker : true);
      const totalQuantity = data.reduce((acc, curr) => acc + curr.hours, 0);
      return { data, totalRecords: data.length, totalQuantity, totalAmount: 0, unit: 'Working Hours' };
    }

    // Salary
    const data = payroll.filter(p => selectedWorker ? p.empId === selectedWorker : true);
    const totalAmount = data.reduce((acc, curr) => acc + curr.netSalary, 0);
    return { data, totalRecords: data.length, totalQuantity: data.length, totalAmount, unit: 'Payslips' };
  };

  const previewInfo = getPreviewData();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-orange-400" /> Professional Reports Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate custom audit statements, preview live totals, and export formatted Excel & PDF files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('excel')}
            disabled={isDownloading === 'excel'}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            {isDownloading === 'excel' ? 'Exporting Excel...' : 'Download Excel'}
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={isDownloading === 'pdf'}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <FileText className="w-4 h-4 stroke-[3]" />
            {isDownloading === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveReportTab(tab.id); setShowPreview(true); }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900 border-orange-500 shadow-xl shadow-orange-500/10'
                  : 'glass-card border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${tab.color}`} />
              <h4 className="text-xs font-bold text-slate-200">{tab.label}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Audit log</p>
              {isActive && <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full m-2" />}
            </button>
          );
        })}
      </div>

      {/* Report Filter Controls Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-400" /> Filter Criteria for {reportTabs.find(t=>t.id===activeReportTab)?.label}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">From Date</label>
            <input
              type="date"
              max={todayDateStr}
              value={fromDate}
              onChange={(e) => {
                const val = e.target.value;
                if (val > todayDateStr) {
                  showToast('Future dates are not allowed', 'warning');
                  setFromDate(todayDateStr);
                } else {
                  setFromDate(val);
                }
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">To Date</label>
            <input
              type="date"
              max={todayDateStr}
              value={toDate}
              onChange={(e) => {
                const val = e.target.value;
                if (val > todayDateStr) {
                  showToast('Future dates are not allowed', 'warning');
                  setToDate(todayDateStr);
                } else {
                  setToDate(val);
                }
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
            />
          </div>

          {activeReportTab === 'import' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Filter Supplier</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                <option value="">All Suppliers</option>
                {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          )}

          {(activeReportTab === 'import' || activeReportTab === 'export' || activeReportTab === 'stock') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Filter Cracker</label>
              <select
                value={selectedCracker}
                onChange={(e) => setSelectedCracker(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                <option value="">All Crackers</option>
                {crackers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}

          {(activeReportTab === 'attendance' || activeReportTab === 'salary') && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Filter Worker</label>
              <select
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              >
                <option value="">All Workers</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name} ({w.id})</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-orange-400" /> View Live Report Preview
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDownload('excel')}
              className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Excel
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Records</p>
            <h3 className="text-xl font-black text-white mt-1">{previewInfo.totalRecords} Entries</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Quantity</p>
            <h3 className="text-xl font-black text-amber-400 mt-1">
              {previewInfo.totalQuantity.toLocaleString('en-IN')} {previewInfo.unit}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Valuation / Amount</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">
              {formatCurrency(previewInfo.totalAmount)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live Preview Table */}
      {showPreview && (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-orange-400" /> Report Audit Preview ({previewInfo.totalRecords} records)
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Date Range: {fromDate} to {toDate}</span>
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="p-3">Ref ID / Date</th>
                  <th className="p-3">Item / Entity</th>
                  <th className="p-3 text-center">Bundles / Qty</th>
                  <th className="p-3 text-right">Value / Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
                {previewInfo.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-amber-400">
                      {row.invoiceNo || row.orderId || row.id || row.empId}
                    </td>
                    <td className="p-3 font-sans font-semibold text-slate-200">
                      {row.cracker || row.name || row.supplier}
                    </td>
                    <td className="p-3 text-center font-bold text-slate-300">
                      {row.bundles || row.availableBundles || row.hours || 1}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      {formatCurrency(row.totalAmount || row.netSalary || 0)}
                    </td>
                    <td className="p-3 text-center font-sans">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-full">
                        {row.paymentStatus || row.status || 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
