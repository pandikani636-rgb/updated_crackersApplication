import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  Printer,
  Download,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Boxes,
  Percent,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  TrendingUp,
  Layers,
  ArrowUpDown,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { API_URL } from '../../utils/api';
import { useApp } from '../../context/AppContext';
import { numberToWords } from '../../utils/numberToWords';
import { InvoiceModal } from '../common/InvoiceModal';
import { exportReportToDocx } from '../../utils/exportDocx';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';
import { downloadInvoicePDF } from '../../utils/invoicePdf';

export const BillingView = () => {
  const {
    customers = [],
    formatCurrency,
    showToast,
    requestConfirm,
    theme
  } = useApp();

  const isLight = theme === 'light';

  // Tab State: 'billing' | 'history' | 'analytics'
  const [activeTab, setActiveTab] = useState('billing');

  // Inventory State (Single Source of Truth)
  const [inventory, setInventory] = useState([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Invoice History State
  const [invoices, setInvoices] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Active modal for viewing / printing finalized invoices
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const generateInitialInvoiceNo = () => {
    const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV-${d}-${rand}`;
  };

  const [invoiceNumber, setInvoiceNumber] = useState(generateInitialInvoiceNo());
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGst, setCustomerGst] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(todayStr);

  const [items, setItems] = useState([]);
  const [hasGst, setHasGst] = useState(true);
  const [gstPercentage, setGstPercentage] = useState(18);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [notes, setNotes] = useState('');

  const [isFinalizing, setIsFinalizing] = useState(false);

  // Fetch Inventory from Backend
  const fetchInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const res = await axios.get(`${API_URL}/stocks/available-inventory`);
      setInventory(res.data);
    } catch (err) {
      showToast('Failed to load real-time inventory', 'error');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  // Fetch Invoices History
  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const res = await axios.get(`${API_URL}/sales`);
      setInvoices(res.data);
    } catch (err) {
      showToast('Failed to load invoice history', 'error');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchInvoices();
  }, []);

  // Filter Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(inventorySearch.toLowerCase());
      const matchCat = categoryFilter ? item.category === categoryFilter : true;
      return matchSearch && matchCat;
    });
  }, [inventory, inventorySearch, categoryFilter]);

  // Unique Categories
  const categories = useMemo(() => {
    const set = new Set();
    inventory.forEach(i => i.category && set.add(i.category));
    return Array.from(set);
  }, [inventory]);

  // Customer Autocomplete Suggestions
  const matchedCustomers = useMemo(() => {
    if (!customerName.trim()) return [];
    return customers.filter(c =>
      (c.name || '').toLowerCase().includes(customerName.toLowerCase())
    ).slice(0, 5);
  }, [customerName, customers]);

  const selectCustomer = (cust) => {
    setCustomerName(cust.name || '');
    if (cust.phone) setCustomerPhone(cust.phone);
    if (cust.address) setCustomerAddress(cust.address);
    if (cust.gst) setCustomerGst(cust.gst);
  };

  // Add Product from Catalog to Invoice
  const handleAddProductToInvoice = (prod) => {
    if (prod.availableQuantity <= 0) {
      showToast(`Cannot add "${prod.name}" - Product is Out of Stock`, 'error');
      return;
    }

    setItems(prev => {
      const existingIdx = prev.findIndex(i => i.productId === prod._id || i.item === prod.name);
      if (existingIdx !== -1) {
        const currentQty = prev[existingIdx].quantity;
        if (currentQty + 1 > prod.availableQuantity) {
          showToast(`Cannot add more. Available stock for "${prod.name}" is ${prod.availableQuantity} Bundles.`, 'warning');
          return prev;
        }
        const updated = [...prev];
        const newQty = currentQty + 1;
        const sub = newQty * updated[existingIdx].unitPrice;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalAmount: sub,
          taxableAmount: Math.max(0, sub - (updated[existingIdx].discount || 0))
        };
        return updated;
      }

      // New line item
      const unitP = Number(prod.sellingPrice || prod.price || 4500);
      return [
        ...prev,
        {
          productId: prod._id,
          item: prod.name,
          sku: prod.sku,
          availableStock: prod.availableQuantity,
          quantity: 1,
          unitPrice: unitP,
          discount: 0,
          gstRate: prod.gstRate || 18,
          taxableAmount: unitP,
          totalAmount: unitP
        }
      ];
    });
    showToast(`Added "${prod.name}" to invoice`, 'success');
  };

  // Update Line Item Values
  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      const target = { ...updated[index] };

      if (field === 'quantity') {
        const entered = Number(value) || 0;
        if (entered > target.availableStock) {
          showToast(`Requested quantity (${entered}) exceeds available stock (${target.availableStock}) for ${target.item}.`, 'error');
          target.quantity = target.availableStock;
        } else {
          target.quantity = Math.max(1, entered);
        }
      } else if (field === 'unitPrice') {
        target.unitPrice = Math.max(0, Number(value) || 0);
      } else if (field === 'discount') {
        target.discount = Math.max(0, Number(value) || 0);
      }

      const sub = target.quantity * target.unitPrice;
      target.totalAmount = sub;
      target.taxableAmount = Math.max(0, sub - (target.discount || 0));

      updated[index] = target;
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Real-Time Calculations
  const calculations = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;

    items.forEach(i => {
      subtotal += (i.quantity * i.unitPrice);
      totalDiscount += (Number(i.discount) || 0);
    });

    const taxableAmount = Math.max(0, subtotal - totalDiscount);
    const gstAmount = hasGst ? Math.round(taxableAmount * (Number(gstPercentage || 18) / 100)) : 0;
    const grandTotal = taxableAmount + gstAmount;

    return {
      subtotal,
      totalDiscount,
      taxableAmount,
      gstAmount,
      grandTotal,
      words: numberToWords(grandTotal)
    };
  }, [items, hasGst, gstPercentage]);

  // Reset Invoice Form
  const resetForm = () => {
    setInvoiceNumber(generateInitialInvoiceNo());
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setCustomerGst('');
    setInvoiceDate(todayStr);
    setItems([]);
    setHasGst(true);
    setGstPercentage(18);
    setNotes('');
    setPaymentMethod('Cash');
    setPaymentStatus('Paid');
  };

  // Preview Invoice (Does NOT deduct stock or save to DB)
  const handlePreviewInvoice = () => {
    if (items.length === 0) {
      showToast('Please add at least one product to the invoice.', 'error');
      return;
    }
    const previewData = {
      invoiceNumber,
      customerName: customerName || 'Walk-in Customer',
      customerPhone,
      customerAddress,
      customerGst,
      date: invoiceDate,
      items,
      subtotal: calculations.subtotal,
      totalDiscount: calculations.totalDiscount,
      taxableAmount: calculations.taxableAmount,
      hasGst,
      gstPercentage,
      gstAmount: calculations.gstAmount,
      grandTotal: calculations.grandTotal,
      paymentMethod,
      paymentStatus,
      status: 'Draft',
      notes
    };
    setSelectedInvoice(previewData);
    setIsInvoiceModalOpen(true);
  };

  // Finalize Invoice & Atomically Deduct Inventory
  const handleFinalizeInvoice = async () => {
    if (items.length === 0) {
      showToast('Please add at least one product to the invoice.', 'error');
      return;
    }
    if (!customerName.trim()) {
      showToast('Please enter customer name or specify "Walk-in Customer".', 'warning');
    }

    requestConfirm({
      title: 'Finalize & Issue Invoice?',
      message: `Are you sure you want to finalize invoice #${invoiceNumber} for ${formatCurrency(calculations.grandTotal)}? Available inventory will be atomically deducted immediately.`,
      confirmText: 'Confirm & Deduct Stock',
      type: 'success',
      onConfirm: async () => {
        setIsFinalizing(true);
        try {
          const payload = {
            invoiceNumber,
            customerName: customerName.trim() || 'Walk-in Customer',
            customerPhone,
            customerAddress,
            customerGst,
            date: invoiceDate,
            items: items.map(i => ({
              productId: i.productId,
              item: i.item,
              sku: i.sku,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              discount: i.discount,
              gstRate: hasGst ? gstPercentage : 0,
              totalAmount: i.totalAmount
            })),
            hasGst,
            gstPercentage,
            paymentMethod,
            paymentStatus,
            notes
          };

          const res = await axios.post(`${API_URL}/sales/finalize`, payload);
          showToast(res.data.message || 'Invoice finalized and stock deducted successfully!', 'success');

          // Refresh inventory and invoices history immediately
          await Promise.all([fetchInventory(), fetchInvoices()]);

          // Open the finalized invoice for printing / downloading
          setSelectedInvoice(res.data.sale);
          setIsInvoiceModalOpen(true);

          // Reset form for next customer
          resetForm();
        } catch (err) {
          const errMsg = err.response?.data?.message || 'Failed to finalize invoice.';
          showToast(errMsg, 'error');
        } finally {
          setIsFinalizing(false);
        }
      }
    });
  };

  // Cancel / Reverse a Finalized Invoice
  const handleCancelInvoice = (invoiceId) => {
    requestConfirm({
      title: 'Cancel Invoice & Restore Stock?',
      message: 'Are you sure you want to cancel this invoice? All billed quantities will be atomically restored back to inventory.',
      confirmText: 'Yes, Cancel & Restore Stock',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await axios.post(`${API_URL}/sales/${invoiceId}/cancel`, {});
          showToast(res.data.message || 'Invoice cancelled and stock restored.', 'info');
          setIsInvoiceModalOpen(false);
          await Promise.all([fetchInventory(), fetchInvoices()]);
        } catch (err) {
          showToast(err.response?.data?.message || 'Failed to cancel invoice', 'error');
        }
      }
    });
  };

  // Filter History Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch =
        (inv.invoiceNumber || '').toLowerCase().includes(historySearch.toLowerCase()) ||
        (inv.customerName || '').toLowerCase().includes(historySearch.toLowerCase()) ||
        (inv.customerPhone || '').includes(historySearch);
      const matchStatus = statusFilter === 'All' ? true : (inv.status === statusFilter || inv.paymentStatus === statusFilter);
      return matchSearch && matchStatus;
    });
  }, [invoices, historySearch, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ── Top Header Banner ── */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border ${isLight ? 'border-slate-200 bg-white/95 shadow-sm' : 'border-slate-800'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold text-[10px] uppercase tracking-wider">
              Live Billing Counter
            </span>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Terminal #01</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5 mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Receipt className="w-7 h-7 text-orange-500" /> Fireworks Billing & POS Terminal
          </h1>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            Directly select inventory items, compute GST, finalize sales & automatically deduct stock with audit logging.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center p-1 rounded-2xl border shrink-0 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'billing'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Receipt className="w-4 h-4" /> Billing Desk
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md'
                : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white')
            }`}
          >
            <Calendar className="w-4 h-4" /> Invoice History ({invoices.length})
          </button>
        </div>
      </div>

      {activeTab === 'billing' ? (
        /* ─── TAB 1: BILLING DESK (Two Columns) ─── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Available Inventory Catalog (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`glass-card p-5 rounded-3xl border space-y-4 ${isLight ? 'border-slate-200 shadow-sm' : 'border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <Boxes className="w-4 h-4 text-orange-500" /> Available Inventory
                  </h3>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>Single source of truth from warehouse database</p>
                </div>
                <button
                  onClick={fetchInventory}
                  className={`p-1.5 rounded-xl transition-colors ${isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'}`}
                  title="Refresh stock"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInventory ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search cracker name or SKU..."
                    className={`w-full pl-8 pr-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all ${
                      isLight ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm' : 'bg-slate-900 border-slate-700/80 text-white placeholder-slate-500'
                    }`}
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-2.5 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all ${
                    isLight ? 'bg-white border-slate-200 text-slate-900 font-medium shadow-sm' : 'bg-slate-900 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Product Cards List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1 custom-scrollbar">
                {filteredInventory.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No matching inventory products found.
                  </div>
                ) : (
                  filteredInventory.map(prod => (
                    <div
                      key={prod._id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        prod.availableQuantity <= 0
                          ? (isLight ? 'bg-slate-100/70 border-slate-200 opacity-60' : 'bg-slate-900/40 border-slate-800/40 opacity-60')
                          : (isLight ? 'bg-white border-slate-200/90 hover:border-orange-500/60 hover:bg-orange-50/20 shadow-sm' : 'bg-slate-900/80 border-slate-800 hover:border-orange-500/50 hover:bg-slate-800/50')
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{prod.name}</h4>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            prod.status === 'In Stock'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : (prod.status === 'Low Stock'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20')
                          }`}>
                            {prod.status}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 text-[10px] mt-1 font-mono ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                          <span>{prod.sku}</span>
                          <span>•</span>
                          <span>{prod.category}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className={`font-black font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                            {formatCurrency(prod.sellingPrice)}
                          </span>
                          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            Stock: <b className={prod.availableQuantity <= prod.reorderLevel ? (isLight ? 'text-amber-600' : 'text-amber-400') : (isLight ? 'text-slate-900' : 'text-slate-200')}>{prod.availableQuantity}</b> {prod.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProductToInvoice(prod)}
                        disabled={prod.availableQuantity <= 0}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-all ${
                          prod.availableQuantity <= 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-slate-950 shadow-md shadow-orange-500/20'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Invoice Builder (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`glass-card p-6 rounded-3xl border space-y-5 ${isLight ? 'border-slate-200 shadow-sm' : 'border-slate-800'}`}>
              
              {/* Customer & Invoice Meta Header */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="relative">
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Customer Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Pandikani Traders or Walk-in"
                      className={`w-full pl-8 pr-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all ${
                        isLight ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      }`}
                    />
                  </div>
                  {/* Autocomplete dropdown */}
                  {matchedCustomers.length > 0 && customerName && (
                    <div className={`absolute z-20 left-0 right-0 mt-1 border rounded-xl shadow-xl overflow-hidden text-xs ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-200'
                    }`}>
                      {matchedCustomers.map(c => (
                        <button
                          key={c.id || c._id}
                          type="button"
                          onClick={() => selectCustomer(c)}
                          className={`w-full px-3 py-2 text-left flex justify-between items-center transition-colors ${
                            isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="font-bold">{c.name}</span>
                          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{c.phone || c.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Customer Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98400 00000"
                      className={`w-full pl-8 pr-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500 transition-all ${
                        isLight ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-mono font-bold focus:outline-none ${
                      isLight ? 'bg-slate-100 border-slate-200 text-amber-700' : 'bg-slate-950 border-slate-800 text-amber-400'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500 ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Invoice Items ({items.length})
                  </h4>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setItems([])}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Clear All Items
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className={`p-8 border-2 border-dashed rounded-2xl text-center text-xs ${
                    isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'
                  }`}>
                    <Boxes className="w-8 h-8 mx-auto mb-2 opacity-40 text-orange-500" />
                    No items added yet. Click <b>"Add"</b> on any inventory product to begin billing.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <h5 className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.item}</h5>
                          <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>{item.sku}</span>
                          <span className={`text-[10px] font-bold font-mono ml-2 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                            (Max: {item.availableStock} Bundles)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <div>
                            <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-500 font-bold' : 'text-slate-500'}`}>Qty</span>
                            <input
                              type="number"
                              min="1"
                              max={item.availableStock}
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                              className={`w-16 px-2 py-1 border rounded-lg text-xs font-mono font-bold text-center focus:outline-none focus:border-orange-500 ${
                                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
                              }`}
                            />
                          </div>

                          <div>
                            <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-500 font-bold' : 'text-slate-500'}`}>Rate (₹)</span>
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                              className={`w-20 px-2 py-1 border rounded-lg text-xs font-mono font-bold text-right focus:outline-none focus:border-orange-500 ${
                                isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white' : 'bg-slate-950 border-slate-700 text-white'
                              }`}
                            />
                          </div>

                          <div>
                            <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-500 font-bold' : 'text-slate-500'}`}>Discount (₹)</span>
                            <input
                              type="number"
                              min="0"
                              value={item.discount}
                              onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                              className={`w-16 px-2 py-1 border rounded-lg text-xs font-mono font-bold text-right text-rose-500 focus:outline-none focus:border-orange-500 ${
                                isLight ? 'bg-slate-50 border-slate-300 focus:bg-white' : 'bg-slate-950 border-slate-700'
                              }`}
                            />
                          </div>

                          <div className="text-right min-w-[70px]">
                            <span className={`text-[9px] block uppercase ${isLight ? 'text-slate-500 font-bold' : 'text-slate-500'}`}>Line Total</span>
                            <span className={`font-bold font-mono text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {formatCurrency(item.totalAmount)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors ml-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GST Toggle Switch */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setHasGst(!hasGst)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      hasGst ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hasGst ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <div>
                    <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Apply GST {hasGst ? `(${gstPercentage}%)` : '(Disabled)'}
                    </span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
                      {hasGst ? 'Calculates CGST + SGST tax breakdown' : 'Tax-exempt / Non-GST billing mode'}
                    </span>
                  </div>
                </div>

                {hasGst && (
                  <div className="flex items-center gap-2">
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setGstPercentage(rate)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          gstPercentage === rate
                            ? (isLight ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40')
                            : (isLight ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100' : 'bg-slate-900 text-slate-400 border border-slate-800')
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Calculation Summary Card */}
              <div className={`p-5 rounded-2xl border space-y-2 text-xs ${
                isLight
                  ? 'bg-slate-50 border-2 border-slate-200 shadow-sm'
                  : 'bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800'
              }`}>
                <div className={`flex justify-between ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                  <span>Subtotal:</span>
                  <span className={`font-mono font-bold ${isLight ? 'text-slate-900 text-sm' : 'text-white'}`}>
                    {formatCurrency(calculations.subtotal)}
                  </span>
                </div>

                {calculations.totalDiscount > 0 && (
                  <div className={`flex justify-between ${isLight ? 'text-rose-600 font-medium' : 'text-rose-400'}`}>
                    <span>Discount:</span>
                    <span className="font-mono font-bold">- {formatCurrency(calculations.totalDiscount)}</span>
                  </div>
                )}

                {hasGst && (
                  <div className={`flex justify-between ${isLight ? 'text-emerald-700 font-semibold' : 'text-emerald-400'}`}>
                    <span>GST Amount ({gstPercentage}%):</span>
                    <span className="font-mono font-bold">+ {formatCurrency(calculations.gstAmount)}</span>
                  </div>
                )}

                <div className={`pt-2 border-t flex justify-between items-center text-sm font-black ${
                  isLight ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'
                }`}>
                  <span>Grand Total:</span>
                  <span className={`text-2xl font-black font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                    {formatCurrency(calculations.grandTotal)}
                  </span>
                </div>

                <div className={`pt-1 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                  <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-500'}`}>In words:</span>{' '}
                  <span className={isLight ? 'font-semibold text-slate-900' : 'italic text-slate-300'}>
                    {calculations.words}
                  </span>
                </div>
              </div>

              {/* Payment Details & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:border-orange-500 ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Net Banking">Net Banking / NEFT</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xl font-medium focus:outline-none focus:border-orange-500 ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Paid">Paid / Cleared</option>
                    <option value="Partial">Partial Advance</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl transition-all border ${
                    isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  Reset Form
                </button>

                <button
                  type="button"
                  onClick={handlePreviewInvoice}
                  disabled={items.length === 0}
                  className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 border ${
                    isLight
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-orange-400 border-orange-500/40'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalizeInvoice}
                  disabled={items.length === 0 || isFinalizing}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFinalizing ? 'Finalizing...' : 'Finalize & Deduct Stock'}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* ─── TAB 2: INVOICE HISTORY & BILLING REPORTS ─── */
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-slate-800'
          }`}>
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search by invoice #, customer name, or phone..."
                className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500 ${
                  isLight ? 'bg-white border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-orange-500 ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}
              >
                <option value="All">All Invoices</option>
                <option value="Finalized">Finalized</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={fetchInvoices}
                className={`p-2 rounded-xl transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Refresh history"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingInvoices ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Invoices History Table */}
          <div className={`rounded-3xl border overflow-hidden ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-slate-800 shadow-xl'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`uppercase tracking-wider font-semibold border-b ${
                  isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}>
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Items</th>
                    <th className="p-3.5 text-right">Taxable</th>
                    <th className="p-3.5 text-right">Grand Total</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isLight ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/80 text-slate-300'
                }`}>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="8" className={`p-8 text-center ${isLight ? 'text-slate-500 font-medium' : 'text-slate-500'}`}>
                        No invoice records found.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv._id || inv.invoiceNumber} className={`transition-colors ${
                        isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                      }`}>
                        <td className={`p-3.5 font-mono font-bold ${
                          isLight ? 'text-amber-700' : 'text-amber-400'
                        }`}>
                          {inv.invoiceNumber}
                        </td>
                        <td className={`p-3.5 font-mono ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                          {inv.date}
                        </td>
                        <td className="p-3.5">
                          <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{inv.customerName}</p>
                          {inv.customerPhone && (
                            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{inv.customerPhone}</p>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            isLight ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {(inv.items || []).length} item{(inv.items || []).length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className={`p-3.5 text-right font-mono ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                          {formatCurrency(inv.taxableAmount || inv.subtotal)}
                        </td>
                        <td className={`p-3.5 text-right font-mono font-black text-sm ${
                          isLight ? 'text-emerald-700' : 'text-emerald-400'
                        }`}>
                          {formatCurrency(inv.grandTotal)}
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                            inv.status === 'Cancelled'
                              ? isLight ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : isLight ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {inv.status || 'Finalized'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsInvoiceModalOpen(true);
                              }}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                                isLight
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                  : 'bg-slate-800 hover:bg-slate-700 text-white'
                              }`}
                              title="View & Print Invoice"
                            >
                              <Printer className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                              <span>Print</span>
                            </button>

                            <button
                              onClick={() => {
                                try {
                                  downloadInvoicePDF(inv, 'SALES_INVOICE');
                                  showToast(`Downloaded PDF for ${inv.invoiceNumber}`, 'success');
                                } catch (e) {
                                  setSelectedInvoice(inv);
                                  setIsInvoiceModalOpen(true);
                                }
                              }}
                              className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                                isLight
                                  ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                                  : 'bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30'
                              }`}
                              title="Download Invoice PDF file"
                            >
                              <Download className="w-3.5 h-3.5 text-indigo-500" />
                              <span>PDF</span>
                            </button>

                            {inv.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleCancelInvoice(inv._id)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  isLight
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                    : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                                }`}
                                title="Cancel invoice and restore stock"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Universal Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedInvoice(null);
          }}
          data={selectedInvoice}
          type="SALES_INVOICE"
          onCancelInvoice={selectedInvoice.status !== 'Cancelled' && selectedInvoice._id ? handleCancelInvoice : null}
        />
      )}
    </div>
  );
};
