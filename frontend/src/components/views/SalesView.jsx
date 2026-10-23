import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Calendar,
  IndianRupee,
  Trash2,
  Printer,
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Percent,
  User,
  Package,
  PlusCircle,
  Eye,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';

export const SalesView = () => {
  const {
    sales = [],
    addSale,
    deleteSale,
    crackers = [],
    shopItems = [],
    customers = [],
    formatCurrency,
    requestConfirm
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null); // Sale object for Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultInvoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  const [formData, setFormData] = useState({
    invoiceNumber: defaultInvoiceNo,
    customerName: '',
    date: todayStr,
    hasGst: false,
    gstPercentage: 18,
    notes: '',
    items: [
      { id: Date.now(), item: '', quantity: 1, amountPerItem: 0, totalAmount: 0 }
    ]
  });

  // Combine item catalog for auto-suggestion / selection
  const catalogSuggestions = useMemo(() => {
    const names = new Set();
    crackers.forEach(c => c.name && names.add(c.name));
    shopItems.forEach(s => s.name && names.add(s.name));
    return Array.from(names);
  }, [crackers, shopItems]);

  // Customer suggestions
  const customerSuggestions = useMemo(() => {
    return customers.map(c => c.name || c.customerName).filter(Boolean);
  }, [customers]);

  // ─── Reset Form ───────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      hasGst: false,
      gstPercentage: 18,
      notes: '',
      items: [
        { id: Date.now(), item: '', quantity: 1, amountPerItem: 0, totalAmount: 0 }
      ]
    });
  };

  // ─── Dynamic Item Handlers ────────────────────────────────────────────
  const handleItemChange = (index, field, value) => {
    setFormData(prev => {
      const updatedItems = [...prev.items];
      const targetItem = { ...updatedItems[index], [field]: value };

      if (field === 'quantity' || field === 'amountPerItem') {
        const q = Number(field === 'quantity' ? value : targetItem.quantity) || 0;
        const amt = Number(field === 'amountPerItem' ? value : targetItem.amountPerItem) || 0;
        targetItem.totalAmount = q * amt;
      }

      updatedItems[index] = targetItem;
      return { ...prev, items: updatedItems };
    });
  };

  const addItemRow = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Date.now() + Math.random(), item: '', quantity: 1, amountPerItem: 0, totalAmount: 0 }
      ]
    }));
  };

  const removeItemRow = (index) => {
    if (formData.items.length === 1) return; // keep at least 1 item
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // ─── Subtotal & GST Calculations for Form ─────────────────────────────
  const formSubtotal = useMemo(() => {
    return formData.items.reduce((acc, row) => {
      const q = Number(row.quantity) || 0;
      const amt = Number(row.amountPerItem) || 0;
      return acc + (q * amt);
    }, 0);
  }, [formData.items]);

  const formGstAmount = useMemo(() => {
    if (!formData.hasGst) return 0;
    const pct = Number(formData.gstPercentage) || 0;
    return formSubtotal * (pct / 100);
  }, [formData.hasGst, formData.gstPercentage, formSubtotal]);

  const formGrandTotal = useMemo(() => {
    return formSubtotal + formGstAmount;
  }, [formSubtotal, formGstAmount]);

  // ─── Submit Sale Handler ──────────────────────────────────────────────
  const handleSubmitSale = async (andPrint = false) => {
    if (!formData.customerName.trim()) {
      alert('Please enter a Customer Name');
      return;
    }

    const validItems = formData.items.filter(i => i.item.trim() !== '');
    if (validItems.length === 0) {
      alert('Please enter at least one valid line item with an Item Name');
      return;
    }

    const salePayload = {
      invoiceNumber: formData.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
      customerName: formData.customerName,
      date: formData.date,
      items: validItems.map(i => ({
        quantity: Number(i.quantity) || 1,
        item: i.item,
        amountPerItem: Number(i.amountPerItem) || 0,
        totalAmount: (Number(i.quantity) || 1) * (Number(i.amountPerItem) || 0)
      })),
      subtotal: formSubtotal,
      hasGst: formData.hasGst,
      gstPercentage: formData.hasGst ? (Number(formData.gstPercentage) || 0) : 0,
      gstAmount: formGstAmount,
      grandTotal: formGrandTotal,
      notes: formData.notes
    };

    const savedSale = await addSale(salePayload);

    setShowForm(false);
    resetForm();

    if (andPrint && savedSale) {
      setActiveInvoice(savedSale);
      setShowInvoiceModal(true);
    }
  };

  // ─── Dashboard Stats Calculations ──────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const todaySalesTotal = useMemo(() => {
    return sales
      .filter(s => s.date === today)
      .reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  }, [sales, today]);

  const monthSalesTotal = useMemo(() => {
    return sales
      .filter(s => (s.date || '').startsWith(currentMonth))
      .reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  }, [sales, currentMonth]);

  const overallSalesTotal = useMemo(() => {
    return sales.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
  }, [sales]);

  // ─── Filter & Sort ────────────────────────────────────────────────────
  const filteredSales = useMemo(() => {
    let list = [...sales];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.customerName || '').toLowerCase().includes(q) ||
        (s.invoiceNumber || '').toLowerCase().includes(q) ||
        (s.items || []).some(i => (i.item || '').toLowerCase().includes(q))
      );
    }

    if (filterMonth) {
      list = list.filter(s => (s.date || '').startsWith(filterMonth));
    }

    list.sort((a, b) => {
      let valA, valB;
      if (sortField === 'grandTotal') {
        valA = Number(a.grandTotal) || 0;
        valB = Number(b.grandTotal) || 0;
      } else if (sortField === 'customerName') {
        valA = (a.customerName || '').toLowerCase();
        valB = (b.customerName || '').toLowerCase();
      } else {
        valA = a.date || '';
        valB = b.date || '';
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [sales, searchQuery, filterMonth, sortField, sortDir]);

  // ─── Print Handler ────────────────────────────────────────────────────
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header & Top Actions ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Sales & Invoicing</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Record sales, calculate GST automatically, and issue instant printable invoices
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>New Sales Entry</span>
        </button>
      </div>

      {/* ─── Summary Dashboard Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Today's Total Sales */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Sales</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(todaySalesTotal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Recorded today ({today})</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60"></div>
        </div>

        {/* This Month's Total Sales */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl group hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">This Month</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(monthSalesTotal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">Month of {currentMonth}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60"></div>
        </div>

        {/* Overall Total Sales */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overall Revenue</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {formatCurrency(overallSalesTotal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">All-time sales revenue</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-60"></div>
        </div>

        {/* Total Invoices Count */}
        <div className="relative overflow-hidden bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Invoices</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-white tracking-tight">
              {sales.length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Invoices issued</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60"></div>
        </div>
      </div>

      {/* ─── Search & Filters Bar ───────────────────────────────────────── */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700/60 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Month Filter */}
          <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-1.5 rounded-xl border border-slate-700/60">
            <Filter className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            />
            {filterMonth && (
              <button onClick={() => setFilterMonth('')} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-slate-800/70 px-3 py-2 rounded-xl border border-slate-700/60 text-sm text-slate-300">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="date" className="bg-slate-900">Sort by Date</option>
              <option value="grandTotal" className="bg-slate-900">Sort by Amount</option>
              <option value="customerName" className="bg-slate-900">Sort by Customer</option>
            </select>
            <button
              onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2 py-0.5 bg-slate-700 text-xs rounded hover:bg-slate-600 transition-all"
            >
              {sortDir.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Sales Records Table ────────────────────────────────────────── */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Sales & Invoices History</span>
          </h2>
          <span className="text-xs text-slate-400">
            Showing {filteredSales.length} of {sales.length} records
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 font-medium text-base">No sales entries found</p>
            <p className="text-xs text-slate-500 mt-1">Click "New Sales Entry" to record your first sale invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Invoice #</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Customer Name</th>
                  <th className="py-3.5 px-4 font-semibold">Items</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Subtotal</th>
                  <th className="py-3.5 px-4 font-semibold text-center">GST</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Grand Total</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSales.map((sale) => (
                  <tr key={sale._id || sale.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">
                      {sale.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {sale.date}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white">
                      {sale.customerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {sale.items ? sale.items.length : 0} Items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-300">
                      {formatCurrency(sale.subtotal)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {sale.hasGst ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {sale.gstPercentage}% ({formatCurrency(sale.gstAmount)})
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">No GST</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-white text-base">
                      {formatCurrency(sale.grandTotal)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setActiveInvoice(sale);
                            setShowInvoiceModal(true);
                          }}
                          className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all"
                          title="View / Print Bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            requestConfirm(
                              'Delete Sale Record',
                              `Are you sure you want to delete invoice ${sale.invoiceNumber}?`,
                              () => deleteSale(sale._id || sale.id)
                            );
                          }}
                          className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* ─── ADD SALE MODAL / FORM ──────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Create Sales Invoice</h3>
                  <p className="text-xs text-slate-400">Fill in sales details to generate invoice and total calculations</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Top Details: Customer Name, Invoice #, Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      list="customer-suggestions"
                      placeholder="Enter customer name..."
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <datalist id="customer-suggestions">
                      {customerSuggestions.map((name, i) => (
                        <option key={i} value={name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>Items List</span>
                  </h4>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/30">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3 font-semibold w-12 text-center">#</th>
                        <th className="py-3 px-3 font-semibold">Item Name</th>
                        <th className="py-3 px-3 font-semibold w-32">Case / Quantity</th>
                        <th className="py-3 px-3 font-semibold w-36">Amount per Item (₹)</th>
                        <th className="py-3 px-3 font-semibold w-40 text-right">Total Amount (₹)</th>
                        <th className="py-3 px-3 font-semibold w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {formData.items.map((row, index) => (
                        <tr key={row.id || index} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 text-center text-slate-500 text-xs">
                            {index + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              list="catalog-suggestions"
                              placeholder="e.g. 50 Shot Flower Pot, Sparklers..."
                              value={row.item}
                              onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.amountPerItem}
                              onChange={(e) => handleItemChange(index, 'amountPerItem', e.target.value)}
                              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700/60 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-400 font-mono text-base">
                            {formatCurrency((Number(row.quantity) || 0) * (Number(row.amountPerItem) || 0))}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {formData.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItemRow(index)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <datalist id="catalog-suggestions">
                    {catalogSuggestions.map((item, i) => (
                      <option key={i} value={item} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* GST Option Section */}
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">GST Applicable?</h4>
                      <p className="text-xs text-slate-400">Select Yes if you want to add GST tax calculation to this bill</p>
                    </div>
                  </div>

                  {/* Radio Buttons: Yes / No */}
                  <div className="flex items-center gap-3 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasGst: true }))}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        formData.hasGst
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasGst: false }))}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        !formData.hasGst
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* GST Percentage Input (Conditional) */}
                {formData.hasGst && (
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      GST Percentage (%)
                    </label>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Presets */}
                      {[5, 12, 18, 28].map(rate => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, gstPercentage: rate }))}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                            formData.gstPercentage === rate
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.gstPercentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, gstPercentage: e.target.value }))}
                        className="w-20 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500 text-center"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Grand Total Calculation Summary */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex justify-between items-center text-sm text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">{formatCurrency(formSubtotal)}</span>
                </div>

                {formData.hasGst && (
                  <div className="flex justify-between items-center text-sm text-emerald-400">
                    <span>GST ({formData.gstPercentage}%):</span>
                    <span className="font-mono">+ {formatCurrency(formGstAmount)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-lg font-bold text-white">
                  <span>Final Total Amount:</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {formatCurrency(formGrandTotal)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Remarks / Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Payment mode, delivery notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 text-slate-300 font-medium rounded-xl hover:bg-slate-700 transition-all text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleSubmitSale(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Record</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmitSale(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Save & Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── PROFESSIONAL SALES TAX INVOICE MODAL ─────────────────────────── */}
      {showInvoiceModal && activeInvoice && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setActiveInvoice(null);
          }}
          type="SALES_INVOICE"
          data={{
            invoiceNumber: activeInvoice.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
            customerName: activeInvoice.customerName || 'Walk-in Customer',
            customerPhone: activeInvoice.customerPhone || '-',
            customerAddress: activeInvoice.customerAddress || 'Retail Counter Sale',
            customerGst: activeInvoice.customerGst || '-',
            date: activeInvoice.date || new Date().toISOString().split('T')[0],
            paymentStatus: activeInvoice.status === 'Cancelled' ? 'CANCELLED' : (activeInvoice.paymentStatus || 'PAID'),
            paymentMethod: activeInvoice.paymentMethod || 'Cash',
            subtotal: Number(activeInvoice.subtotal) || (activeInvoice.items || []).reduce((s, i) => s + (Number(i.totalAmount) || 0), 0),
            discount: Number(activeInvoice.discount) || 0,
            hasGst: Boolean(activeInvoice.hasGst),
            taxRate: activeInvoice.hasGst ? (Number(activeInvoice.gstPercentage) || 18) : 0,
            taxAmount: Number(activeInvoice.gstAmount) || 0,
            finalAmount: Number(activeInvoice.grandTotal) || Number(activeInvoice.totalAmount) || 0,
            notes: activeInvoice.notes || 'Thank you for your business! Celebrations made brighter.',
            items: (activeInvoice.items || []).map((item, idx) => ({
              name: item.item || item.name || `Cracker Item ${idx + 1}`,
              sku: item.sku || `CRK-${String(idx + 1).padStart(3, '0')}`,
              quantity: Number(item.quantity) || 1,
              unit: item.unit || 'bundles',
              rate: Number(item.amountPerItem || item.price || item.rate) || 0,
              discount: 0,
              taxable: Number(item.totalAmount) || (Number(item.quantity) * Number(item.amountPerItem || 0)),
              gstRate: activeInvoice.hasGst ? (Number(activeInvoice.gstPercentage) || 18) : 0,
              total: Number(item.totalAmount) || (Number(item.quantity) * Number(item.amountPerItem || 0))
            }))
          }}
        />
      )}
    </div>
  );
};
