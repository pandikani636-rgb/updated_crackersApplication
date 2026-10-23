import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet,
  Download,
  Boxes,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Printer,
  Calendar,
  FileCode,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { API_URL } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { exportReportToDocx } from '../../utils/exportDocx';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';

export const InventoryReportsView = () => {
  const { formatCurrency, showToast } = useApp();

  // Active Report Category
  // 'current' | 'valuation' | 'lowStock' | 'movements' | 'stockIn' | 'stockOut'
  const [reportType, setReportType] = useState('valuation');

  const [isLoading, setIsLoading] = useState(false);
  const [stockReportData, setStockReportData] = useState({
    summary: {},
    detailedStock: [],
    lowStockItems: [],
    outOfStockItems: []
  });
  const [movements, setMovements] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchReportsData = async () => {
    setIsLoading(true);
    try {
      const [stocksRes, movementsRes] = await Promise.all([
        axios.get(`${API_URL}/stocks/reports`),
        axios.get(`${API_URL}/stock-movements`)
      ]);
      setStockReportData(stocksRes.data);
      setMovements(movementsRes.data);
    } catch (err) {
      showToast('Failed to load inventory report data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // Compute Active Table Rows & Columns
  const currentView = useMemo(() => {
    const list = stockReportData.detailedStock || [];

    if (reportType === 'lowStock') {
      const filtered = (stockReportData.lowStockItems || []).concat(stockReportData.outOfStockItems || []);
      const cols = [
        { header: 'Product Name', key: 'name' },
        { header: 'Category', key: 'category' },
        { header: 'Available Bundles', key: 'availableBundles' },
        { header: 'Reorder Level', key: 'reorderLevel' },
        { header: 'Status', key: 'status' }
      ];
      return {
        title: 'Low Stock & Critical Inventory Alert Report',
        data: filtered,
        columns: cols
      };
    }

    if (reportType === 'movements') {
      const filtered = movements.filter(m =>
        m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      const cols = [
        { header: 'Date', key: 'date' },
        { header: 'Product', key: 'productName' },
        { header: 'Type', key: 'type' },
        { header: 'Quantity Changed', key: 'quantity' },
        { header: 'Stock After', key: 'newStock' },
        { header: 'Reference', key: 'invoiceNumber' },
        { header: 'Notes', key: 'notes' }
      ];
      return {
        title: 'Stock Movement Audit History Report',
        data: filtered,
        columns: cols
      };
    }

    if (reportType === 'stockIn') {
      const filtered = movements.filter(m => m.quantity > 0);
      const cols = [
        { header: 'Date', key: 'date' },
        { header: 'Product', key: 'productName' },
        { header: 'Inward Qty (Bundles)', key: 'quantity' },
        { header: 'New Total Stock', key: 'newStock' },
        { header: 'Invoice / Ref', key: 'invoiceNumber' },
        { header: 'Notes', key: 'notes' }
      ];
      return {
        title: 'Stock-In & Purchase Inward Report',
        data: filtered,
        columns: cols
      };
    }

    if (reportType === 'stockOut') {
      const filtered = movements.filter(m => m.quantity < 0);
      const cols = [
        { header: 'Date', key: 'date' },
        { header: 'Product', key: 'productName' },
        { header: 'Outward Qty (Bundles)', key: 'quantity' },
        { header: 'Remaining Stock', key: 'newStock' },
        { header: 'Invoice Number', key: 'invoiceNumber' },
        { header: 'Remarks', key: 'notes' }
      ];
      return {
        title: 'Stock-Out & Sales Dispatch Report',
        data: filtered,
        columns: cols
      };
    }

    // Default: Valuation report
    const filtered = list.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory ? item.category === selectedCategory : true;
      return matchSearch && matchCat;
    });

    const cols = [
      { header: 'Product Name', key: 'name' },
      { header: 'Category', key: 'category' },
      { header: 'Stock (Bundles)', key: 'availableBundles' },
      { header: 'Cost Price (₹)', key: 'costPrice' },
      { header: 'Valuation Basis (₹)', key: 'valuation' },
      { header: 'Selling Price (₹)', key: 'sellingPrice' },
      { header: 'Potential Revenue (₹)', key: 'potentialRevenue' },
      { header: 'Status', key: 'status' }
    ];

    return {
      title: 'Inventory Valuation Report (Cost Basis Accounting)',
      data: filtered,
      columns: cols
    };
  }, [reportType, stockReportData, movements, searchTerm, selectedCategory]);

  // Export to PDF
  const handleExportPDF = () => {
    downloadPDF(
      `Inventory_${reportType}_Report`,
      currentView.title,
      currentView.columns,
      currentView.data,
      {
        'Total Records': currentView.data.length,
        'Valuation Cost Basis': formatCurrency(stockReportData.summary?.totalValuation || 0),
        'Potential Sales Value': formatCurrency(stockReportData.summary?.totalSellingValuation || 0)
      }
    );
    showToast(`${currentView.title} exported as PDF!`, 'success');
  };

  // Export to Word (.docx)
  const handleExportWord = () => {
    exportReportToDocx(
      currentView.title,
      currentView.columns,
      currentView.data,
      {
        'Generated': new Date().toLocaleString('en-IN'),
        'Valuation Basis': formatCurrency(stockReportData.summary?.totalValuation || 0),
        'Total Products': currentView.data.length
      }
    );
    showToast(`${currentView.title} exported as Word document!`, 'success');
  };

  // Export to Excel (.xlsx)
  const handleExportExcel = () => {
    downloadExcel(
      `Inventory_${reportType}_Report`,
      'Inventory',
      currentView.columns,
      currentView.data
    );
    showToast(`${currentView.title} exported as Excel spreadsheet!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-wider">
              Statutory Stock Audit
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5 mt-1">
            <FileSpreadsheet className="w-7 h-7 text-amber-500" /> Inventory Valuation & Stock Audit Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cost-basis inventory accounting, stock movement audit trails, low-stock notifications & multi-format exports.
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" /> Word (.docx)
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel (.xlsx)
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* KPI Cards: Valuation Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory Valuation (Cost Basis)</p>
            <h3 className="text-xl font-black text-amber-400 font-mono mt-1">
              {formatCurrency(stockReportData.summary?.totalValuation || 0)}
            </h3>
            <span className="text-[10px] text-slate-500">Based on wholesale acquisition cost</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Potential Sales Value</p>
            <h3 className="text-xl font-black text-emerald-400 font-mono mt-1">
              {formatCurrency(stockReportData.summary?.totalSellingValuation || 0)}
            </h3>
            <span className="text-[10px] text-slate-500">At current MRP / selling rates</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Available Stock</p>
            <h3 className="text-xl font-black text-white font-mono mt-1">
              {stockReportData.summary?.totalBundles || 0} Bundles
            </h3>
            <span className="text-[10px] text-slate-500">Across {stockReportData.summary?.totalProducts || 0} categories</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Low Stock Items</p>
            <h3 className="text-xl font-black text-rose-400 font-mono mt-1">
              {stockReportData.summary?.lowStockCount || 0} Products
            </h3>
            <span className="text-[10px] text-slate-500">Below threshold reorder level</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Report Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'valuation', label: 'Valuation & Cost Basis', icon: Sparkles },
          { id: 'lowStock', label: 'Low Stock & Critical', icon: AlertTriangle },
          { id: 'movements', label: 'Stock Movement Audit', icon: Clock },
          { id: 'stockIn', label: 'Stock-In (Imports)', icon: ArrowDownLeft },
          { id: 'stockOut', label: 'Stock-Out (Sales)', icon: ArrowUpRight }
        ].map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setReportType(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                reportType === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report by product or ref..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <button
          onClick={fetchReportsData}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Report Table Preview */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            {currentView.title} ({currentView.data.length} records)
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            Generated: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-10 text-center">#</th>
                {currentView.columns.map(c => (
                  <th key={c.key} className="p-3">{c.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
              {currentView.data.length === 0 ? (
                <tr>
                  <td colSpan={currentView.columns.length + 1} className="p-8 text-center text-slate-500 font-sans">
                    No records found for the selected report filters.
                  </td>
                </tr>
              ) : (
                currentView.data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-center text-slate-500">{idx + 1}</td>
                    {currentView.columns.map(c => {
                      const val = row[c.key];
                      const isMoney = c.key.includes('Price') || c.key.includes('valuation') || c.key.includes('Revenue');
                      const isQty = c.key.includes('quantity');
                      const isNegative = isQty && val < 0;

                      return (
                        <td key={c.key} className={`p-3 ${isMoney ? 'font-bold text-emerald-400' : ''}`}>
                          {isMoney ? (
                            formatCurrency(val)
                          ) : isNegative ? (
                            <span className="text-rose-400 font-bold">{val}</span>
                          ) : (
                            String(val !== undefined && val !== null ? val : '—')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
