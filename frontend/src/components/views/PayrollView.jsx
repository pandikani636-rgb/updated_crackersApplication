import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  IndianRupee,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';

export const PayrollView = () => {
  const {
    payroll,
    paySalary,
    formatCurrency,
    workers,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentModal, setPaymentModal] = useState(null);
  const [bonusInput, setBonusInput] = useState(1000);
  const [deductionInput, setDeductionInput] = useState(0);
  const [payslipModal, setPayslipModal] = useState(null);

  const filteredPayroll = payroll.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPayroll = payroll.reduce((acc, curr) => acc + curr.netSalary, 0);
  const paidPayroll = payroll.filter((p) => p.status === 'Paid').reduce((acc, curr) => acc + curr.netSalary, 0);
  const pendingPayroll = payroll.filter((p) => p.status === 'Pending').reduce((acc, curr) => acc + curr.netSalary, 0);

  const handleOpenPayModal = (item) => {
    setPaymentModal(item);
    setBonusInput(item.bonus || 1000);
    setDeductionInput(item.deduction || 0);
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!paymentModal) return;
    const success = await paySalary(paymentModal.empId, bonusInput, deductionInput);
    if (success) {
      const updated = {
        ...paymentModal,
        bonus: Number(bonusInput),
        deduction: Number(deductionInput),
        netSalary: paymentModal.basicSalary + Number(bonusInput) - Number(deductionInput),
        status: 'Paid',
        date: new Date().toISOString().split('T')[0]
      };
      setPayslipModal(updated);
    }
    setPaymentModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" /> Payroll & Salary Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculate worker monthly net payouts, bonus additions, leave deductions & disburse salaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast('Disbursing pending payroll via bank batch transfer...', 'info')}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <DollarSign className="w-4 h-4" /> Batch Disburse Payroll
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Monthly Payroll</p>
            <h3 className="text-xl font-black text-white mt-1">{formatCurrency(totalPayroll)}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Paid Salary</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">{formatCurrency(paidPayroll)}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Pending Salary</p>
            <h3 className="text-xl font-black text-amber-400 mt-1">{formatCurrency(pendingPayroll)}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Workers</p>
            <h3 className="text-xl font-black text-orange-400 mt-1">{workers.length} Employees</h3>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker by name or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500"
        >
          <option value="">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Payroll Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Employee ID</th>
                <th className="p-4">Worker Name</th>
                <th className="p-4">Month</th>
                <th className="p-4 text-right">Basic Salary</th>
                <th className="p-4 text-center">Days (Pres/Total)</th>
                <th className="p-4 text-right">Bonus</th>
                <th className="p-4 text-right">Deduction</th>
                <th className="p-4 text-right">Net Salary</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Payment Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredPayroll.map((item) => (
                <tr key={item.empId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{item.empId}</td>
                  <td className="p-4 font-bold text-white">{item.name}</td>
                  <td className="p-4 font-medium text-slate-400">{item.month}</td>
                  <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(item.basicSalary)}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-200">
                    {item.presentDays} / {item.workingDays}
                  </td>
                  <td className="p-4 text-right font-mono text-emerald-400">+₹{item.bonus.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right font-mono text-rose-400">-₹{item.deduction.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right font-mono font-black text-amber-400 text-sm">
                    {formatCurrency(item.netSalary)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      item.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {item.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-400">{item.date}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => handleOpenPayModal(item)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-md transition-all"
                        >
                          Pay Salary
                        </button>
                      ) : (
                        <button
                          onClick={() => setPayslipModal(item)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                          title="View Payslip"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setPaymentModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Disburse Salary Payment</h3>
            <p className="text-xs text-slate-400 mb-4">Worker: <span className="text-amber-400 font-bold">{paymentModal.name}</span> ({paymentModal.empId})</p>

            <form onSubmit={handleExecutePayment} className="space-y-4">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Basic Monthly Salary:</span> <span className="text-slate-200">{formatCurrency(paymentModal.basicSalary)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Present Working Days:</span> <span className="text-slate-200">{paymentModal.presentDays} / {paymentModal.workingDays}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Performance Bonus (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={bonusInput}
                  onChange={(e) => setBonusInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Leave / Advance Deduction (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={deductionInput}
                  onChange={(e) => setDeductionInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-rose-400"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300 font-bold">Calculated Net Payout:</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  {formatCurrency(paymentModal.basicSalary + Number(bonusInput) - Number(deductionInput))}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPaymentModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-600/30"
                >
                  Confirm & Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enterprise Payslip Invoice Modal */}
      {payslipModal && (
        <InvoiceModal
          isOpen={!!payslipModal}
          onClose={() => setPayslipModal(null)}
          data={payslipModal}
          type="PAYROLL_PAYSLIP"
        />
      )}
    </div>
  );
};
