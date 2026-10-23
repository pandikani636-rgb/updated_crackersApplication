import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  Search,
  Download,
  Trash2,
  Edit,
  Calendar,
  Layers,
  Calculator,
  FileSpreadsheet,
  Boxes,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';

export const ExportsView = () => {
  const {
    currentTab,
    setCurrentTab,
    dailyRegisters,
    shopItems,
    addDailyRegister,
    updateDailyRegister,
    deleteDailyRegister,
    showToast,
    requestConfirm
  } = useApp();

  const todayDateStr = new Date().toISOString().split('T')[0];

  // Tab mode: 'existingStock' (Admin Existing Stock) | 'register' (Daily Register)
  const [activeTab, setActiveTab] = useState(() => {
    return currentTab === 'ExportsRegister' ? 'register' : 'existingStock';
  });

  useEffect(() => {
    if (currentTab === 'ExportsRegister') {
      setActiveTab('register');
    } else if (currentTab === 'ExportsStock' || currentTab === 'Exports') {
      setActiveTab('existingStock');
    }
  }, [currentTab]);

  // Existing Stock Entry by Admin (Stored in localStorage)
  const [existingStocks, setExistingStocks] = useState(() => {
    try {
      const saved = localStorage.getItem('crackerhub_export_existing_stocks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [selectedStockItem, setSelectedStockItem] = useState('');
  const [stockInputCount, setStockInputCount] = useState('100');

  useEffect(() => {
    if (shopItems && shopItems.length > 0 && !selectedStockItem) {
      setSelectedStockItem(shopItems[0].name);
    }
  }, [shopItems]);

  const handleSaveExistingStock = (e) => {
    e.preventDefault();
    if (!selectedStockItem) return;
    const countNum = Math.max(0, Number(stockInputCount) || 0);
    const updated = {
      ...existingStocks,
      [selectedStockItem]: countNum
    };
    setExistingStocks(updated);
    localStorage.setItem('crackerhub_export_existing_stocks', JSON.stringify(updated));
    showToast(`Existing stock set for ${selectedStockItem}: ${countNum} Units`, 'success');
  };

  const handleDeleteExistingStock = (itemKey) => {
    requestConfirm({
      title: 'Remove Existing Stock Baseline?',
      message: `Are you sure you want to remove baseline stock for ${itemKey}?`,
      onConfirm: () => {
        const updated = { ...existingStocks };
        delete updated[itemKey];
        setExistingStocks(updated);
        localStorage.setItem('crackerhub_export_existing_stocks', JSON.stringify(updated));
        showToast(`Baseline stock removed for ${itemKey}`, 'info');
      }
    });
  };

  // Daily Register State
  const [date, setDate] = useState(todayDateStr);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [openingStock, setOpeningStock] = useState(0);
  const [productionQty, setProductionQty] = useState('0');
  const [salesQty, setSalesQty] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');
  const [itemFilter, setItemFilter] = useState('');

  // Edit Daily Register Modal State
  const [editingRegister, setEditingRegister] = useState(null);

  const handleDateChange = (newVal) => {
    if (newVal > todayDateStr) {
      showToast('Future dates are not allowed.', 'warning');
      setDate(todayDateStr);
    } else {
      setDate(newVal);
    }
  };

  // Initialize selected item from shopItems
  useEffect(() => {
    if (shopItems && shopItems.length > 0 && !selectedItemName) {
      setSelectedItemName(shopItems[0].name);
    }
  }, [shopItems]);

  // Calculate opening stock ONLY from Export data (Existing stock baseline OR previous day export remaining stock)
  useEffect(() => {
    if (!selectedItemName || !date) return;

    const prevD = new Date(date);
    prevD.setDate(prevD.getDate() - 1);
    const prevDateStr = prevD.toISOString().split('T')[0];

    // 1. Check exact previous day entry in Export Register
    const prevRecord = dailyRegisters.find(
      (r) => r.itemName === selectedItemName && r.date === prevDateStr
    );

    if (prevRecord) {
      setOpeningStock(Number(prevRecord.remainingStock || 0));
      return;
    }

    // 2. Check latest prior entry in Export Register
    const priorRecords = dailyRegisters
      .filter((r) => r.itemName === selectedItemName && r.date < date)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (priorRecords.length > 0) {
      setOpeningStock(Number(priorRecords[0].remainingStock || 0));
      return;
    }

    // 3. Fallback: Take Admin Existing Stock
    const initialAdminStock = existingStocks[selectedItemName] !== undefined ? existingStocks[selectedItemName] : 0;
    setOpeningStock(initialAdminStock);
  }, [date, selectedItemName, dailyRegisters, existingStocks]);

  // Derived automatic calculations
  const prodNum = Math.max(0, Number(productionQty) || 0);
  const salesNum = Math.max(0, Number(salesQty) || 0);
  const totalStockComputed = Number(openingStock || 0) + prodNum;
  const remainingStockComputed = Math.max(0, totalStockComputed - salesNum);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItemName) {
      showToast('Please select an item', 'error');
      return;
    }

    const payload = {
      date,
      itemName: selectedItemName,
      openingStock: Number(openingStock),
      productionQty: prodNum,
      totalStock: totalStockComputed,
      salesQty: salesNum,
      remainingStock: remainingStockComputed,
      remarks: `Export daily register entry for ${date}`
    };

    await addDailyRegister(payload);
    showToast(`Daily Export & Stock record saved for ${selectedItemName} on ${date}! Remaining Stock: ${remainingStockComputed}`, 'success');

    // Reset inputs
    setProductionQty('0');
    setSalesQty('0');
  };

  const handleUpdateRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!editingRegister) return;

    const pQty = Math.max(0, Number(editingRegister.productionQty) || 0);
    const sQty = Math.max(0, Number(editingRegister.salesQty) || 0);
    const opStock = Number(editingRegister.openingStock) || 0;
    const totStock = opStock + pQty;
    const remStock = Math.max(0, totStock - sQty);

    const updatedPayload = {
      ...editingRegister,
      productionQty: pQty,
      salesQty: sQty,
      totalStock: totStock,
      remainingStock: remStock
    };

    await updateDailyRegister(editingRegister._id || editingRegister.id, updatedPayload);
    setEditingRegister(null);
  };

  // Filter daily registers list
  const filteredRegisters = dailyRegisters.filter((reg) => {
    const matchesSearch =
      reg.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.date && reg.date.includes(searchTerm));
    const matchesItem = itemFilter ? reg.itemName === itemFilter : true;
    return matchesSearch && matchesItem;
  });

  const handleDownloadExcel = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'itemName' },
      { header: 'Opening Stock', key: 'openingStock' },
      { header: 'Today Production', key: 'productionQty' },
      { header: 'Total Stock', key: 'totalStock' },
      { header: 'Total Sales', key: 'salesQty' },
      { header: 'Remaining Stock', key: 'remainingStock' }
    ];
    downloadExcel('Export_Stock_Register_Report', 'Export Register', cols, filteredRegisters);
    showToast('Export Register downloaded as Excel!', 'success');
  };

  const handleDownloadPDF = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'itemName' },
      { header: 'Opening', key: 'openingStock' },
      { header: 'Production', key: 'productionQty' },
      { header: 'Total Stock', key: 'totalStock' },
      { header: 'Sales', key: 'salesQty' },
      { header: 'Remaining', key: 'remainingStock' }
    ];
    const totalProdSum = filteredRegisters.reduce((acc, c) => acc + (c.productionQty || 0), 0);
    const totalSalesSum = filteredRegisters.reduce((acc, c) => acc + (c.salesQty || 0), 0);

    downloadPDF('Export_Stock_Register_Report', 'Export & Daily Stock Register Report', cols, filteredRegisters, {
      'Total Entries': filteredRegisters.length,
      'Total Production': `${totalProdSum} Units`,
      'Total Sales': `${totalSalesSum} Units`
    });
    showToast('Export Register downloaded as PDF!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowUpRight className="w-6 h-6 text-emerald-400" /> Export & Daily Stock Register
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Independent Export management. Define item stock baseline and track daily production, sales, & remaining stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Toggle - Admin Existing Stock First, Daily Register Second */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
            <button
              onClick={() => {
                setActiveTab('existingStock');
                setCurrentTab('ExportsStock');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'existingStock' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Admin Existing Stock
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setCurrentTab('ExportsRegister');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'register' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4" /> Daily Register
            </button>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" /> PDF Report
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ADMIN EXISTING STOCK ENTRY (FIRST)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'existingStock' && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-orange-400" /> Admin Existing Item Stock Entry
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter existing baseline stock for items added in Item Master. Export opening stock will use this data.
            </p>
          </div>

          <form onSubmit={handleSaveExistingStock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Select Item Name (From Item Master)
              </label>
              <select
                value={selectedStockItem}
                onChange={(e) => setSelectedStockItem(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-orange-500/40 rounded-xl text-xs font-bold text-white focus:border-orange-500 shadow-md"
              >
                {shopItems.map((item) => (
                  <option key={item._id || item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Enter Existing Stock Count</label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={stockInputCount}
                onWheel={(e) => e.currentTarget.blur()}
                onChange={(e) => setStockInputCount(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 100"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-blue-400 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Existing Item Stock
              </button>
            </div>
          </form>

          {/* Configured Admin Existing Stocks List with Edit & Delete */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300">Configured Admin Existing Stocks:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {Object.keys(existingStocks).length === 0 ? (
                <p className="text-slate-500 italic col-span-2">No custom existing stock set yet. Default opening stock is 0.</p>
              ) : (
                Object.keys(existingStocks).map((itemKey) => (
                  <div key={itemKey} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-200 font-bold block">{itemKey}</span>
                      <span className="text-blue-400 font-black">{existingStocks[itemKey]} Units</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedStockItem(itemKey);
                          setStockInputCount(String(existingStocks[itemKey]));
                          showToast(`Loaded ${itemKey} for editing stock count`, 'info');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20"
                        title="Edit Baseline Stock"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExistingStock(itemKey)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                        title="Delete Baseline Stock"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TODAY'S PRODUCTION & REGISTER ENTRY (SECOND)                            */}
      {/* ========================================================================= */}
      {activeTab === 'register' && (
        <>
          <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-400" /> Today's Production & Register Entry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select item & date. Opening stock loads from Admin Existing Stock or previous day remaining stock.
                </p>
              </div>

              {/* Date Box with Crisp Dark Calendar Icon */}
              <div className="flex items-center gap-2.5 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shadow-inner">
                <div className="w-6 h-6 rounded-lg bg-amber-400 flex items-center justify-center shrink-0 shadow">
                  <Calendar className="w-3.5 h-3.5 text-slate-950 font-black" />
                </div>
                <span className="text-xs font-bold text-slate-200 shrink-0">Select Register Date:</span>
                <input
                  type="date"
                  max={todayDateStr}
                  value={date}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Item Dropdown */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" /> Select Item Export (From Item Master)
                  </label>
                  <select
                    value={selectedItemName}
                    onChange={(e) => setSelectedItemName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-orange-500/40 rounded-xl text-xs font-bold text-white focus:border-orange-500 shadow-md"
                  >
                    {shopItems.map((item) => (
                      <option key={item._id || item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Box 1: Opening Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Opening Stock (Auto Displayed)
                  </label>
                  <div className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-blue-400 flex items-center justify-between">
                    <span className="text-slate-400">Stock Exists:</span>
                    <span className="text-sm font-black">{openingStock} Units</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Auto loaded from Admin Existing Stock or previous day remaining stock.
                  </p>
                </div>

                {/* Input 1: Today's Production (Text input with wheel blur) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Today's Production of Item
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={productionQty}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setProductionQty(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter today's production count"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400 focus:border-emerald-500"
                  />
                </div>

                {/* Display Box 2: Total Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Total Stock (Opening Stock + Today's Production)
                  </label>
                  <div className="w-full px-4 py-2.5 bg-slate-950 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold text-emerald-400 flex items-center justify-between shadow-sm">
                    <span className="text-slate-400">Opening + Prod:</span>
                    <span className="text-sm font-black">{totalStockComputed} Units</span>
                  </div>
                </div>

                {/* Input 2: Total Sales Data (Text input with wheel blur) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Total Sales Data (Units Sold Today)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={salesQty}
                    onWheel={(e) => e.currentTarget.blur()}
                    onChange={(e) => setSalesQty(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter total sales count"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-amber-500/40 rounded-xl text-xs font-mono font-bold text-amber-400 focus:border-amber-500"
                  />
                </div>

                {/* Display Box 3: Remaining Stock */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Remaining Stock (Total Stock - Total Sales)
                  </label>
                  <div className="w-full px-4 py-2.5 bg-slate-950 border border-orange-500/40 rounded-xl text-xs font-mono font-bold text-orange-400 flex items-center justify-between shadow-md">
                    <span className="text-slate-400">Final Remaining:</span>
                    <span className="text-base font-black">{remainingStockComputed} Units</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Will automatically become next day's opening stock!
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Daily Register Entry
                </button>
              </div>
            </form>
          </div>

          {/* Date-wise Register History Table with Edit and Delete Options */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-orange-400" /> Export & Daily Stock Register Audit Log
              </h3>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search date or item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <select
                  value={itemFilter}
                  onChange={(e) => setItemFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Items</option>
                  {shopItems.map((c) => (
                    <option key={c._id || c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Item Name</th>
                    <th className="p-4 text-center">Opening Stock</th>
                    <th className="p-4 text-center">Today Production</th>
                    <th className="p-4 text-center">Total Stock</th>
                    <th className="p-4 text-center">Total Sales</th>
                    <th className="p-4 text-center">Remaining Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredRegisters.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-500 font-medium">
                        No export daily register entries found for selected query.
                      </td>
                    </tr>
                  ) : (
                    filteredRegisters.map((item) => (
                      <tr key={item._id || item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-medium text-slate-300">{item.date}</td>
                        <td className="p-4 font-bold text-white">{item.itemName}</td>
                        <td className="p-4 text-center font-mono font-bold text-blue-400">{item.openingStock}</td>
                        <td className="p-4 text-center font-mono font-bold text-emerald-400">+{item.productionQty}</td>
                        <td className="p-4 text-center font-mono font-bold text-slate-200">{item.totalStock}</td>
                        <td className="p-4 text-center font-mono font-bold text-amber-400">-{item.salesQty}</td>
                        <td className="p-4 text-center font-mono font-black text-orange-400 text-sm">
                          {item.remainingStock}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingRegister(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/20"
                              title="Edit Register Entry"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                requestConfirm({
                                  title: 'Delete Daily Register Entry?',
                                  message: `Are you sure you want to delete daily entry for ${item.itemName} on ${item.date}?`,
                                  onConfirm: () => deleteDailyRegister(item._id || item.id)
                                });
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                              title="Delete Entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Edit Daily Register Modal */}
      {editingRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setEditingRegister(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black tracking-tight text-white mb-1 flex items-center gap-2">
              <Edit className="w-5 h-5 text-orange-400" /> Edit Daily Register Record
            </h3>
            <p className="text-xs text-slate-400 mb-6">Modify production and sales quantities for {editingRegister.itemName} on {editingRegister.date}.</p>

            <form onSubmit={handleUpdateRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name & Date</label>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between text-xs font-bold">
                  <span className="text-white">{editingRegister.itemName}</span>
                  <span className="text-amber-400 font-mono">{editingRegister.date}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Opening Stock (Units)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editingRegister.openingStock}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setEditingRegister({ ...editingRegister, openingStock: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Today's Production (Units)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editingRegister.productionQty}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setEditingRegister({ ...editingRegister, productionQty: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Sales (Units)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={editingRegister.salesQty}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setEditingRegister({ ...editingRegister, salesQty: e.target.value.replace(/[^0-9]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingRegister(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl shadow-md"
                >
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
