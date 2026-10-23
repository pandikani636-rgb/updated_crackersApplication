import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Edit,
  Eye,
  ArrowDownLeft,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertCircle,
  List,
  Calculator,
  IndianRupee,
  Layers,
  Calendar,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';
import { InvoiceModal } from '../common/InvoiceModal';

export const ImportsView = () => {
  const {
    currentTab,
    setCurrentTab,
    imports,
    shopItems,
    addImport,
    updateImport,
    deleteImport,
    formatCurrency,
    requestConfirm,
    showToast
  } = useApp();

  // Sub-navigation view mode: 'add' | 'list'
  const [subView, setSubView] = useState(() => {
    return currentTab === 'ImportsAdd' ? 'add' : 'list';
  });

  useEffect(() => {
    if (currentTab === 'ImportsAdd') {
      setSubView('add');
    } else if (currentTab === 'ImportsList') {
      setSubView('list');
    }
  }, [currentTab]);

  // Filters & Search for List view
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [itemFilter, setItemFilter] = useState('');
  const [viewDetailModal, setViewDetailModal] = useState(null);
  const [editingImport, setEditingImport] = useState(null);
  const [selectedImportInvoice, setSelectedImportInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const todayDateStr = new Date().toISOString().split('T')[0];

  // Form State for Add Import view (Cleaned: invoiceNo, supplier, remarks removed)
  const [formData, setFormData] = useState({
    date: todayDateStr,
    itemName: '',
    unitCost: 0,
    quantity: 10,
    paidAmount: 0
  });

  // Initialize itemName & unitCost from shopItems if available
  useEffect(() => {
    if (shopItems && shopItems.length > 0 && !formData.itemName) {
      const first = shopItems[0];
      setFormData((prev) => ({
        ...prev,
        itemName: first.name,
        unitCost: Number(first.cost || 0)
      }));
    }
  }, [shopItems]);

  // Calculations
  const totalAmountComputed = Number(formData.quantity || 0) * Number(formData.unitCost || 0);
  const paidAmountComputed = Number(formData.paidAmount || 0);
  const balanceAmountComputed = Math.max(0, totalAmountComputed - paidAmountComputed);

  // Calculate cumulative summary if same product was added before
  const previousItemImports = imports.filter(
    (imp) => (imp.itemName || imp.cracker || '').toLowerCase() === (formData.itemName || '').toLowerCase()
  );

  const prevTotalAmount = previousItemImports.reduce((acc, curr) => acc + Number(curr.totalAmount || 0), 0);
  const prevPaidAmount = previousItemImports.reduce(
    (acc, curr) => acc + Number(curr.paidAmount !== undefined ? curr.paidAmount : (curr.paymentStatus === 'Paid' ? curr.totalAmount : 0)),
    0
  );
  const prevBalanceAmount = previousItemImports.reduce(
    (acc, curr) => acc + Number(curr.balanceAmount !== undefined ? curr.balanceAmount : (curr.paymentStatus === 'Paid' ? 0 : curr.totalAmount)),
    0
  );

  const aggregatedTotalAmount = prevTotalAmount + totalAmountComputed;
  const aggregatedPaidAmount = prevPaidAmount + paidAmountComputed;
  const aggregatedBalanceAmount = prevBalanceAmount + balanceAmountComputed;

  // Handle item dropdown selection
  const handleItemSelect = (selectedName) => {
    const matchedItem = shopItems.find((item) => item.name === selectedName);
    const cost = matchedItem ? Number(matchedItem.cost) : 0;
    setFormData((prev) => ({
      ...prev,
      itemName: selectedName,
      unitCost: cost
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.itemName) {
      showToast('Please select an item name from dropdown', 'error');
      return;
    }
    if (Number(formData.quantity) <= 0) {
      showToast('Please enter valid quantity', 'error');
      return;
    }

    let status = 'Paid';
    if (balanceAmountComputed > 0 && paidAmountComputed > 0) {
      status = 'Partial';
    } else if (balanceAmountComputed > 0 && paidAmountComputed === 0) {
      status = 'Pending';
    }

    const payload = {
      date: formData.date,
      invoiceNo: `INV-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: 'Shop Inventory',
      cracker: formData.itemName,
      itemName: formData.itemName,
      bundles: Number(formData.quantity),
      quantity: Number(formData.quantity),
      costPerBundle: Number(formData.unitCost),
      unitCost: Number(formData.unitCost),
      totalAmount: totalAmountComputed,
      paidAmount: paidAmountComputed,
      balanceAmount: balanceAmountComputed,
      paymentStatus: status,
      remarks: 'Shop Import Add'
    };

    await addImport(payload);
    showToast(`Import entry saved for ${formData.itemName}! Total: ₹${totalAmountComputed}, Balance: ₹${balanceAmountComputed}`, 'success');

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      itemName: shopItems[0]?.name || '',
      unitCost: shopItems[0]?.cost || 0,
      quantity: 10,
      paidAmount: 0
    });

    // Switch to list view
    setSubView('list');
    if (setCurrentTab) setCurrentTab('ImportsList');
  };

  const filteredImports = imports.filter((item) => {
    const itemName = item.itemName || item.cracker || '';
    const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.paymentStatus === statusFilter : true;
    const matchesItem = itemFilter ? itemName === itemFilter : true;
    return matchesSearch && matchesStatus && matchesItem;
  });

  const handleDownloadExcel = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'cracker' },
      { header: 'Quantity', key: 'bundles' },
      { header: 'Unit Cost (₹)', key: 'costPerBundle' },
      { header: 'Total Amount (₹)', key: 'totalAmount' },
      { header: 'Paid Amount (₹)', key: 'paidAmount' },
      { header: 'Balance Amount (₹)', key: 'balanceAmount' },
      { header: 'Status', key: 'paymentStatus' }
    ];
    downloadExcel('Import_Shipments_Report', 'Imports', cols, filteredImports);
    showToast('Import List downloaded as Excel file!', 'success');
  };

  const handleDownloadPDF = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'cracker' },
      { header: 'Qty', key: 'bundles' },
      { header: 'Cost (₹)', key: 'costPerBundle' },
      { header: 'Total (₹)', key: 'totalAmount' },
      { header: 'Paid (₹)', key: 'paidAmount' },
      { header: 'Balance (₹)', key: 'balanceAmount' },
      { header: 'Status', key: 'paymentStatus' }
    ];
    const totalImportSum = filteredImports.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
    const totalPaidSum = filteredImports.reduce((acc, c) => acc + (c.paidAmount || (c.paymentStatus === 'Paid' ? c.totalAmount : 0)), 0);
    const totalBalanceSum = filteredImports.reduce((acc, c) => acc + (c.balanceAmount || (c.paymentStatus === 'Paid' ? 0 : c.totalAmount)), 0);

    downloadPDF('Import_Shipments_Report', 'Import Section Audit Report', cols, filteredImports, {
      'Total Imports': filteredImports.length,
      'Total Amount': `₹${totalImportSum.toLocaleString('en-IN')}`,
      'Total Paid': `₹${totalPaidSum.toLocaleString('en-IN')}`,
      'Total Balance': `₹${totalBalanceSum.toLocaleString('en-IN')}`
    });
    showToast('Import Report downloaded as PDF!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar with Sub-Menu Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowDownLeft className="w-6 h-6 text-blue-400" /> Import Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track item purchases into shop inventory date-wise. Add new imports with auto paid & balance calculations.
          </p>
        </div>

        {/* Option Toggle / Sub-menu: Add & List */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
            <button
              onClick={() => {
                setSubView('add');
                if (setCurrentTab) setCurrentTab('ImportsAdd');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subView === 'add'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Add Import
            </button>
            <button
              onClick={() => {
                setSubView('list');
                if (setCurrentTab) setCurrentTab('ImportsList');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                subView === 'list'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" /> Import List ({imports.length})
            </button>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/20 flex items-center gap-1.5 transition-all"
            title="Download Excel"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
            title="Download PDF"
          >
            <Download className="w-4 h-4 text-orange-400" /> PDF
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: ADD IMPORT FORM (Cleaned: invoiceNo, supplier, remarks removed) */}
      {/* ========================================================================= */}
      {subView === 'add' && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-400" /> Add Import Entry
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select item from Item Master dropdown. Cost, Total Amount, Paid Amount, and Balance Amount auto calculate.
              </p>
            </div>
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 font-mono text-xs font-bold rounded-full">
              Add Import Mode
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Date Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" /> Entry Date
                </label>
                <input
                  type="date"
                  required
                  max={todayDateStr}
                  value={formData.date}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected > todayDateStr) {
                      showToast('Future dates are not allowed', 'warning');
                      setFormData({ ...formData, date: todayDateStr });
                    } else {
                      setFormData({ ...formData, date: selected });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:border-orange-500"
                />
              </div>

              {/* Item Name Dropdown (Populated from Item Master) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Select Item Name (From Item Master)
                </label>
                <select
                  value={formData.itemName}
                  onChange={(e) => handleItemSelect(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-orange-500/40 rounded-xl text-xs font-bold text-white focus:border-orange-500 shadow-md"
                >
                  {shopItems.length === 0 ? (
                    <option value="">No items found in Item Master catalog</option>
                  ) : (
                    shopItems.map((item) => (
                      <option key={item._id || item.id} value={item.name}>
                        {item.name} — Cost: ₹{item.cost}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Dropdown options populated dynamically from Item Master catalog.
                </p>
              </div>

              {/* Display Box 1: Item Cost */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Cost of Item (Auto)</label>
                <div className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-200 flex items-center justify-between">
                  <span>Unit Cost:</span>
                  <span className="text-emerald-400">{formatCurrency(formData.unitCost)}</span>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Quantity of Item</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.quantity}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 font-bold focus:border-orange-500"
                />
              </div>

              {/* Display Box 2: Total Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Total Amount (Auto Calculated)</label>
                <div className="w-full px-3.5 py-2.5 bg-slate-950 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold text-emerald-400 flex items-center justify-between shadow-sm">
                  <span>Cost × Qty:</span>
                  <span className="text-sm font-black">{formatCurrency(totalAmountComputed)}</span>
                </div>
              </div>

              {/* Paid Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Paid Amount (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.paidAmount}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-blue-500/40 rounded-xl text-xs font-mono text-blue-400 font-bold focus:border-blue-500"
                />
              </div>

              {/* Display Box 3: Balance Amount */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Balance Amount (Total Amount - Paid Amount)
                </label>
                <div className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Calculated Balance Due to Pay</p>
                      <h4 className="text-xl font-black text-amber-400 font-mono">
                        {formatCurrency(balanceAmountComputed)}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono space-y-0.5">
                    <p className="text-slate-400">Total Amount: <span className="text-slate-200">{formatCurrency(totalAmountComputed)}</span></p>
                    <p className="text-slate-400">Paid Amount: <span className="text-blue-400">{formatCurrency(paidAmountComputed)}</span></p>
                    <p className="text-slate-400">Remaining Balance: <span className="text-rose-400 font-bold">{formatCurrency(balanceAmountComputed)}</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Same Product History / Cumulative Math Box */}
            {formData.itemName && (
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Cumulative Total for "{formData.itemName}" (If added again)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Previous Records: {previousItemImports.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Aggregated Total Amount</p>
                    <p className="text-sm font-black text-slate-100 mt-1">{formatCurrency(aggregatedTotalAmount)}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Aggregated Paid Amount</p>
                    <p className="text-sm font-black text-emerald-400 mt-1">{formatCurrency(aggregatedPaidAmount)}</p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Aggregated Balance Amount</p>
                    <p className="text-sm font-black text-amber-400 mt-1">{formatCurrency(aggregatedBalanceAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSubView('list');
                  if (setCurrentTab) setCurrentTab('ImportsList');
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel & View List
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-orange-500/20"
              >
                Save Import Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: IMPORT LIST VIEW WITH FILTERS & PDF/EXCEL EXPORT            */}
      {/* ========================================================================= */}
      {subView === 'list' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Items</option>
                {shopItems.map((c) => (
                  <option key={c._id || c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          {/* Imports Data Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Item Name</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Unit Cost</th>
                    <th className="p-4 text-right">Total Amount</th>
                    <th className="p-4 text-right">Paid Amount</th>
                    <th className="p-4 text-right">Balance</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredImports.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-slate-500 font-medium">
                        No import records found matching query.
                      </td>
                    </tr>
                  ) : (
                    filteredImports.map((item) => {
                      const itemName = item.itemName || item.cracker;
                      const totalAmt = item.totalAmount;
                      const paidAmt = item.paidAmount !== undefined ? item.paidAmount : (item.paymentStatus === 'Paid' ? totalAmt : 0);
                      const balAmt = item.balanceAmount !== undefined ? item.balanceAmount : (item.paymentStatus === 'Paid' ? 0 : totalAmt);

                      return (
                        <tr key={item._id || item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono font-medium text-slate-300">{item.date}</td>
                          <td className="p-4 font-bold text-white">{itemName}</td>
                          <td className="p-4 text-center font-bold text-slate-300">{item.bundles || item.quantity}</td>
                          <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(item.costPerBundle || item.unitCost)}</td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-400">{formatCurrency(totalAmt)}</td>
                          <td className="p-4 text-right font-mono font-bold text-blue-400">{formatCurrency(paidAmt)}</td>
                          <td className="p-4 text-right font-mono font-bold text-amber-400">{formatCurrency(balAmt)}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              item.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.paymentStatus === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {item.paymentStatus === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                              {item.paymentStatus === 'Pending' && <Clock className="w-3 h-3" />}
                              {item.paymentStatus === 'Partial' && <AlertCircle className="w-3 h-3" />}
                              {item.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedImportInvoice(item);
                                  setIsInvoiceModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                                title="Purchase Invoice / Bill"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setViewDetailModal(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingImport(item)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20"
                                title="Edit Import Record"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  requestConfirm({
                                    title: 'Delete Import Record?',
                                    message: `Are you sure you want to remove import for ${itemName}?`,
                                    onConfirm: () => deleteImport(item._id || item.id)
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                title="Delete Import"
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
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setViewDetailModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ArrowDownLeft className="w-5 h-5 text-blue-400" /> Import Record Details
            </h3>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="text-slate-200">{viewDetailModal.date}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Item Name:</span> <span className="font-bold text-white">{viewDetailModal.itemName || viewDetailModal.cracker}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Quantity:</span> <span className="font-bold text-slate-200">{viewDetailModal.bundles || viewDetailModal.quantity}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Unit Cost:</span> <span className="font-mono text-slate-200">{formatCurrency(viewDetailModal.costPerBundle || viewDetailModal.unitCost)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Amount:</span> <span className="font-mono text-emerald-400 font-bold">{formatCurrency(viewDetailModal.totalAmount)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Paid Amount:</span> <span className="font-mono text-blue-400 font-bold">{formatCurrency(viewDetailModal.paidAmount !== undefined ? viewDetailModal.paidAmount : (viewDetailModal.paymentStatus === 'Paid' ? viewDetailModal.totalAmount : 0))}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Balance Amount:</span> <span className="font-mono text-amber-400 font-bold">{formatCurrency(viewDetailModal.balanceAmount !== undefined ? viewDetailModal.balanceAmount : (viewDetailModal.paymentStatus === 'Paid' ? 0 : viewDetailModal.totalAmount))}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment Status:</span> <span className="font-bold text-emerald-400">{viewDetailModal.paymentStatus}</span></div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  setSelectedImportInvoice(viewDetailModal);
                  setIsInvoiceModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Printer className="w-4 h-4" /> View / Print Invoice
              </button>
              <button
                onClick={() => setViewDetailModal(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Import Modal */}
      {editingImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setEditingImport(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-400" /> Edit Import Record
            </h3>
            <p className="text-xs text-slate-400 mb-4">Modify entry details for {editingImport.itemName || editingImport.cracker}.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const qty = Math.max(1, Number(editingImport.quantity) || 1);
                const uCost = Math.max(0, Number(editingImport.unitCost || editingImport.costPerBundle) || 0);
                const pAmt = Math.max(0, Number(editingImport.paidAmount) || 0);
                const tAmt = qty * uCost;
                const bAmt = Math.max(0, tAmt - pAmt);
                const pStat = bAmt === 0 ? 'Paid' : pAmt > 0 ? 'Partial' : 'Pending';

                const updated = {
                  ...editingImport,
                  quantity: qty,
                  bundles: qty,
                  unitCost: uCost,
                  costPerBundle: uCost,
                  totalAmount: tAmt,
                  paidAmount: pAmt,
                  balanceAmount: bAmt,
                  paymentStatus: pStat
                };

                await updateImport(editingImport._id || editingImport.id, updated);
                setEditingImport(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-bold mb-1">Entry Date</label>
                <input
                  type="date"
                  max={todayDateStr}
                  value={editingImport.date || todayDateStr}
                  onChange={(e) => setEditingImport({ ...editingImport, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Item Name</label>
                <select
                  value={editingImport.itemName || editingImport.cracker}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const matchedItem = shopItems.find(s => s.name === selectedName);
                    const cost = matchedItem ? matchedItem.cost : (editingImport.unitCost || 0);
                    setEditingImport({
                      ...editingImport,
                      itemName: selectedName,
                      cracker: selectedName,
                      unitCost: cost,
                      costPerBundle: cost
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  {shopItems.map((item) => (
                    <option key={item._id || item.id} value={item.name}>
                      {item.name} — Cost: ₹{item.cost}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Quantity</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editingImport.quantity || editingImport.bundles || ''}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setEditingImport({ ...editingImport, quantity: e.target.value.replace(/[^0-9]/g, ''), bundles: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit Cost (₹)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editingImport.unitCost || editingImport.costPerBundle || ''}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setEditingImport({ ...editingImport, unitCost: e.target.value.replace(/[^0-9.]/g, ''), costPerBundle: e.target.value.replace(/[^0-9.]/g, '') })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Paid Amount (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editingImport.paidAmount !== undefined ? editingImport.paidAmount : ''}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setEditingImport({ ...editingImport, paidAmount: e.target.value.replace(/[^0-9.]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-blue-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingImport(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl shadow-md"
                >
                  Update Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase / Import Invoice Modal */}
      {isInvoiceModalOpen && selectedImportInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedImportInvoice(null);
          }}
          type="PURCHASE_INVOICE"
          data={{
            invoiceNo: selectedImportInvoice.invoiceNo || `PUR-${(selectedImportInvoice._id || selectedImportInvoice.id || '001').slice(-6).toUpperCase()}`,
            id: selectedImportInvoice.invoiceNo || `PUR-${(selectedImportInvoice._id || selectedImportInvoice.id || '001').slice(-6).toUpperCase()}`,
            date: selectedImportInvoice.date,
            supplierName: selectedImportInvoice.supplier || 'Raw Material & Fireworks Vendor',
            supplierPhone: selectedImportInvoice.supplierPhone || '+91 98421 00000',
            supplierGst: selectedImportInvoice.supplierGst || '33AABCS1429B1Z1',
            supplierAddress: selectedImportInvoice.supplierAddress || 'Industrial Estate, Sivakasi - 626123',
            paymentStatus: selectedImportInvoice.paymentStatus || 'Paid',
            paymentMode: 'Bank Transfer / Cash',
            subtotal: Number(selectedImportInvoice.totalAmount) || 0,
            discount: 0,
            taxRate: 0,
            taxAmount: 0,
            finalAmount: Number(selectedImportInvoice.totalAmount) || 0,
            paidAmount: Number(selectedImportInvoice.paidAmount !== undefined ? selectedImportInvoice.paidAmount : (selectedImportInvoice.paymentStatus === 'Paid' ? selectedImportInvoice.totalAmount : 0)),
            balanceAmount: Number(selectedImportInvoice.balanceAmount !== undefined ? selectedImportInvoice.balanceAmount : (selectedImportInvoice.paymentStatus === 'Paid' ? 0 : selectedImportInvoice.totalAmount)),
            notes: selectedImportInvoice.remarks || 'Stock intake registered in central inventory.',
            items: [
              {
                name: selectedImportInvoice.itemName || selectedImportInvoice.cracker,
                sku: `IMP-${(selectedImportInvoice.itemName || 'ITEM').slice(0, 3).toUpperCase()}`,
                quantity: Number(selectedImportInvoice.quantity || selectedImportInvoice.bundles) || 1,
                unit: 'bundles',
                rate: Number(selectedImportInvoice.unitCost || selectedImportInvoice.costPerBundle) || 0,
                discount: 0,
                taxable: Number(selectedImportInvoice.totalAmount) || 0,
                gstRate: 0,
                total: Number(selectedImportInvoice.totalAmount) || 0
              }
            ]
          }}
        />
      )}
    </div>
  );
};
