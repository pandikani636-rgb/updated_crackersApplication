import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  IndianRupee,
  Trash2,
  Edit3,
  X,
  TrendingUp,
  Clock,
  Wallet,
  ChevronDown,
  FileText,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';

export const OtherExpensesView = () => {
  const {
    otherExpenses,
    addOtherExpense,
    updateOtherExpense,
    deleteOtherExpense,
    formatCurrency,
    requestConfirm,
    theme
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const [formData, setFormData] = useState({
    reason: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // ─── Calculations ────────────────────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const todayTotal = useMemo(() =>
    otherExpenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [otherExpenses, today]
  );

  const monthTotal = useMemo(() =>
    otherExpenses
      .filter(e => (e.date || '').startsWith(currentMonth))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [otherExpenses, currentMonth]
  );

  const overallTotal = useMemo(() =>
    otherExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [otherExpenses]
  );

  const expenseCount = otherExpenses.length;

  // ─── Filtering & Sorting ─────────────────────────────────────────────
  const filteredExpenses = useMemo(() => {
    let list = [...otherExpenses];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        (e.reason || '').toLowerCase().includes(q) ||
        (e.notes || '').toLowerCase().includes(q) ||
        String(e.amount).includes(q)
      );
    }

    // Month filter
    if (filterMonth) {
      list = list.filter(e => (e.date || '').startsWith(filterMonth));
    }

    // Sort
    list.sort((a, b) => {
      let valA, valB;
      if (sortField === 'amount') {
        valA = Number(a.amount) || 0;
        valB = Number(b.amount) || 0;
      } else if (sortField === 'date') {
        valA = a.date || '';
        valB = b.date || '';
      } else {
        valA = (a.reason || '').toLowerCase();
        valB = (b.reason || '').toLowerCase();
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [otherExpenses, searchQuery, filterMonth, sortField, sortDir]);

  // ─── Form Handlers ───────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({ reason: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.reason.trim() || !formData.amount || !formData.date) return;

    const payload = {
      reason: formData.reason.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      notes: formData.notes.trim()
    };

    if (editingId) {
      updateOtherExpense(editingId, payload);
    } else {
      addOtherExpense(payload);
    }
    resetForm();
  };

  const handleEdit = (expense) => {
    setFormData({
      reason: expense.reason || '',
      amount: expense.amount || '',
      date: expense.date || '',
      notes: expense.notes || ''
    });
    setEditingId(expense._id || expense.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (expense) => {
    requestConfirm({
      title: 'Delete Expense',
      message: `Are you sure you want to delete "${expense.reason}" (${formatCurrency(expense.amount)})?`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: () => deleteOtherExpense(expense._id || expense.id)
    });
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // ─── Summary Cards Config ────────────────────────────────────────────
  const summaryCards = [
    {
      title: "Today's Expenses",
      value: formatCurrency(todayTotal),
      subtitle: `${otherExpenses.filter(e => e.date === today).length} expense(s) today`,
      icon: Clock,
      gradient: 'from-blue-600/20 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
      accentBg: 'bg-blue-500/10'
    },
    {
      title: "This Month's Expenses",
      value: formatCurrency(monthTotal),
      subtitle: `${otherExpenses.filter(e => (e.date || '').startsWith(currentMonth)).length} expense(s) this month`,
      icon: Calendar,
      gradient: 'from-violet-600/20 to-purple-600/10',
      borderColor: 'border-violet-500/30',
      iconColor: 'text-violet-400',
      accentBg: 'bg-violet-500/10'
    },
    {
      title: 'Overall Total Expenses',
      value: formatCurrency(overallTotal),
      subtitle: `${expenseCount} total expense(s)`,
      icon: Wallet,
      gradient: 'from-orange-600/20 to-amber-600/10',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-orange-400',
      accentBg: 'bg-orange-500/10'
    },
    {
      title: 'Average Per Expense',
      value: formatCurrency(expenseCount > 0 ? overallTotal / expenseCount : 0),
      subtitle: expenseCount > 0 ? 'Across all records' : 'No records yet',
      icon: TrendingUp,
      gradient: 'from-emerald-600/20 to-teal-600/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      accentBg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header Banner ─────────────────────────────────────────── */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">
              <Receipt className="w-4 h-4" /> Miscellaneous Expenses
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Other Expenses</h2>
            <p className="text-xs text-slate-400 mt-1">
              Track and manage all miscellaneous and additional expenses. Add new expenses, view history, and monitor totals.
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className={`px-5 py-2.5 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shrink-0 ${
              showForm
                ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 shadow-none'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-orange-500/20'
            }`}
          >
            {showForm ? <X className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`glass-card p-5 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.gradient} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
            >
              <div className="absolute top-3 right-3">
                <div className={`w-10 h-10 rounded-xl ${card.accentBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-xl font-black text-slate-100 mt-1">{card.value}</h3>
              <p className="text-[11px] text-slate-500 mt-1">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* ── Add/Edit Expense Form ─────────────────────────────────── */}
      {showForm && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 animate-fade-in">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              {editingId ? <Edit3 className="w-4 h-4 text-orange-400" /> : <Plus className="w-4 h-4 text-orange-400" />}
            </div>
            <h3 className="text-base font-bold text-slate-100">{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3" /> Expense Reason *
              </label>
              <input
                type="text"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g. Office Supplies, Fuel, Repair..."
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <IndianRupee className="w-3 h-3" /> Amount (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3" /> Notes (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 lg:col-span-4 flex items-center gap-3 mt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                {editingId ? 'Update Expense' : 'Save Expense'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search & Filter Bar ───────────────────────────────────── */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reason, notes, or amount..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
          />
        </div>

        <div className="relative flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
          />
          {filterMonth && (
            <button
              onClick={() => setFilterMonth('')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Clear month filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {filteredExpenses.length} record{filteredExpenses.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Expense History Table ─────────────────────────────────── */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-400" /> Expense History
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            Total: <span className="text-orange-400 font-bold">{formatCurrency(filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0))}</span>
          </span>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-slate-400">No expenses found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery || filterMonth ? 'Try adjusting your filters' : 'Click "Add Expense" to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800/80">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                  <th
                    onClick={() => toggleSort('reason')}
                    className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-orange-400 transition-colors"
                  >
                    <span className="flex items-center gap-1">Reason <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-orange-400 transition-colors"
                  >
                    <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th
                    onClick={() => toggleSort('date')}
                    className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-orange-400 transition-colors"
                  >
                    <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notes</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, idx) => (
                  <tr
                    key={expense._id || expense.id || idx}
                    className="border-b border-slate-800/40 hover:bg-slate-900/50 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4 text-rose-400" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200">{expense.reason}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-500" /> {formatDate(expense.date)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 max-w-[200px] truncate" title={expense.notes}>
                      {expense.notes || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsVoucherOpen(true);
                          }}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
                          title="Print / View Expense Voucher"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all"
                          title="Edit expense"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Expense Payment Voucher Modal */}
      {isVoucherOpen && selectedExpense && (
        <InvoiceModal
          isOpen={isVoucherOpen}
          onClose={() => {
            setIsVoucherOpen(false);
            setSelectedExpense(null);
          }}
          type="EXPENSE_VOUCHER"
          data={{
            voucherNo: `VCH-${(selectedExpense._id || selectedExpense.id || '001').slice(-6).toUpperCase()}`,
            id: `VCH-${(selectedExpense._id || selectedExpense.id || '001').slice(-6).toUpperCase()}`,
            date: selectedExpense.date,
            paidTo: selectedExpense.reason,
            reason: selectedExpense.reason,
            category: 'Operational & General Expense',
            amount: selectedExpense.amount,
            subtotal: selectedExpense.amount,
            finalAmount: selectedExpense.amount,
            paymentMode: 'Cash / Bank Transfer',
            notes: selectedExpense.notes || `Disbursed for: ${selectedExpense.reason}`,
            authorizedBy: 'Accounts Officer',
            items: [
              {
                name: selectedExpense.reason,
                quantity: 1,
                unit: 'disbursal',
                rate: Number(selectedExpense.amount) || 0,
                discount: 0,
                taxable: Number(selectedExpense.amount) || 0,
                gstRate: 0,
                total: Number(selectedExpense.amount) || 0
              }
            ]
          }}
        />
      )}
    </div>
  );
};
