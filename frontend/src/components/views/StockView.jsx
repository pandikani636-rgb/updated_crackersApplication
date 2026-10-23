import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';

export const StockView = () => {
  const { stock, setStock, crackers, showToast, setCurrentTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'movement'
  const [adjustModal, setAdjustModal] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState(5);
  const [adjustReason, setAdjustReason] = useState('Safety Audit Adjustment');

  const categories = Array.from(new Set(stock.map((s) => s.category)));

  const filteredStock = stock.filter((item) => {
    const matchesSearch =
      item.cracker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = stock.filter((s) => s.status === 'Low Stock' || s.availableBundles <= s.reorderLevel).length;
  const inStockCount = stock.filter((s) => s.status === 'In Stock').length;

  const handleDownloadExcel = () => {
    const cols = [
      { header: 'Cracker Name', key: 'cracker' },
      { header: 'Category', key: 'category' },
      { header: 'Total Imported', key: 'totalImported' },
      { header: 'Total Exported', key: 'totalExported' },
      { header: 'Available Bundles', key: 'availableBundles' },
      { header: 'Available Packets', key: 'availablePackets' },
      { header: 'Reorder Level', key: 'reorderLevel' },
      { header: 'Status', key: 'status' },
      { header: 'Last Updated', key: 'lastUpdated' }
    ];
    downloadExcel('Total_Items_Available_Stock_Report', 'Items Available', cols, filteredStock);
    showToast('Total available items list downloaded as Excel!', 'success');
  };

  const handleDownloadPDF = () => {
    const cols = [
      { header: 'Item Name', key: 'cracker' },
      { header: 'Category', key: 'category' },
      { header: 'Imported', key: 'totalImported' },
      { header: 'Exported', key: 'totalExported' },
      { header: 'Avail Bundles', key: 'availableBundles' },
      { header: 'Avail Packets', key: 'availablePackets' },
      { header: 'Status', key: 'status' }
    ];
    const totalAvail = filteredStock.reduce((acc, c) => acc + (c.availableBundles || 0), 0);
    downloadPDF('Total_Items_Available_Stock_Report', 'Total Available Items Stock Report', cols, filteredStock, {
      'Total Items': filteredStock.length,
      'Available Stock': `${totalAvail} Bundles`,
      'Low Stock Items': lowStockCount
    });
    showToast('Available items report downloaded as PDF!', 'success');
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    if (!adjustModal) return;

    setStock((prev) =>
      prev.map((item) => {
        if (item.id === adjustModal.id) {
          const updatedBundles = Math.max(0, item.availableBundles + Number(adjustAmount));
          const pktsPerBundle = item.availableBundles > 0 ? Math.round(item.availablePackets / item.availableBundles) : 100;
          const updatedPackets = updatedBundles * pktsPerBundle;
          const updatedStatus = updatedBundles > item.reorderLevel ? 'In Stock' : 'Low Stock';
          return {
            ...item,
            availableBundles: updatedBundles,
            availablePackets: updatedPackets,
            status: updatedStatus,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return item;
      })
    );

    showToast(`Stock updated for ${adjustModal.cracker}: ${adjustAmount > 0 ? '+' : ''}${adjustAmount} Bundles`, 'success');
    setAdjustModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-orange-400" /> Item Available & Stock Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time warehouse stock tracking, total available items, & reorder alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Download Excel
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" /> Download PDF
          </button>

          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inventory' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inventory Table
            </button>
            <button
              onClick={() => setActiveTab('movement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'movement' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Stock Movement
            </button>
          </div>
        </div>
      </div>


      {/* Overview Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Total Cracker Items</p>
            <h3 className="text-xl font-black text-white mt-1">{stock.length} Products</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Healthy Stock Items</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">{inStockCount} Items</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase">Low Stock Alerts</p>
            <h3 className="text-xl font-black text-rose-400 mt-1">{lowStockCount} Items</h3>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cracker name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Cracker Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Total Imported</th>
                    <th className="p-4 text-center">Total Exported</th>
                    <th className="p-4 text-center">Avail. Bundles</th>
                    <th className="p-4 text-center">Avail. Packets</th>
                    <th className="p-4 text-center">Reorder Level</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Last Updated</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredStock.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                        {item.cracker}
                      </td>
                      <td className="p-4 font-medium text-slate-400">{item.category}</td>
                      <td className="p-4 text-center font-bold text-blue-400">{item.totalImported} Bundles</td>
                      <td className="p-4 text-center font-bold text-emerald-400">{item.totalExported} Bundles</td>
                      <td className="p-4 text-center font-mono font-black text-amber-400 text-sm">
                        {item.availableBundles} Bundles
                      </td>
                      <td className="p-4 text-center font-mono text-slate-300">
                        {item.availablePackets.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-center text-slate-400 font-mono">{item.reorderLevel} Bundles</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          item.status === 'In Stock'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.status === 'Low Stock'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status === 'In Stock' && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === 'Low Stock' && <AlertTriangle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-400">{item.lastUpdated}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setAdjustModal(item)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] rounded-lg border border-slate-700 transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Stock Movement Tab */
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-100 mb-2">Recent Stock Movement Logs</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Import Arrival - Lakshmi Crack</h4>
                  <p className="text-[11px] text-slate-400">+20 Bundles added from Sivakasi Fireworks Ltd</p>
                </div>
              </div>
              <span className="text-xs font-mono text-blue-400 font-bold">2026-08-25</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Export Order Sale - Sanguchakra</h4>
                  <p className="text-[11px] text-slate-400">-8 Bundles dispatched to Venkatesh Traders</p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">2026-08-26</span>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Manual Stock Audit Adjustment - Ground Chakkar</h4>
                  <p className="text-[11px] text-slate-400">+5 Bundles restocked after physical safety count</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">2026-08-24</span>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setAdjustModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Adjust Inventory Stock</h3>
            <p className="text-xs text-slate-400 mb-4">Item: <span className="text-amber-400 font-bold">{adjustModal.cracker}</span></p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Bundles Available</label>
                <input
                  type="text"
                  disabled
                  value={`${adjustModal.availableBundles} Bundles`}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bundle Adjustment (+ or -)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={adjustAmount}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setAdjustAmount(e.target.value.replace(/[^0-9\-+]/g, ''))}
                  placeholder="e.g. 5 or -2"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">Enter positive number to add stock, negative to subtract damaged/lost items.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Reason</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 rounded-xl"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
