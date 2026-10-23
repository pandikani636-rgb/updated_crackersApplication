import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  IndianRupee,
  ShieldAlert,
  CheckCircle2,
  FileText,
  X,
  CreditCard,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomersView = () => {
  const { customers, addCustomer, formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Wholesale',
    contactPerson: 'K. Rajan',
    phone: '+91 98409 11223',
    email: 'contact@customer.com',
    gst: '33AAAAC1111A1Z1',
    creditLimit: 200000,
    paymentTerms: 'Net 30'
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.gst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? c.type === typeFilter : true;
    return matchesSearch && matchesType;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addCustomer(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" /> Customer Management (CRM Core)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Wholesale, Distributor, Retailer & Dealer profiles, credit limit tracking, due dates & order history.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Customer
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, contact person or GST..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full md:w-auto"
        >
          <option value="">All Customer Types</option>
          <option value="Wholesale">Wholesale</option>
          <option value="Distributor">Distributor</option>
          <option value="Retailer">Retailer</option>
          <option value="Dealer">Dealer</option>
          <option value="Direct">Direct Customer</option>
        </select>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((cust) => (
          <div key={cust.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{cust.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {cust.type}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-white mt-2">{cust.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Contact: <span className="text-slate-200 font-medium">{cust.contactPerson}</span></p>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs font-mono my-3">
                <div className="flex justify-between text-slate-400"><span>GST:</span> <span className="text-slate-200">{cust.gst}</span></div>
                <div className="flex justify-between text-slate-400"><span>Phone:</span> <span className="text-slate-200">{cust.phone}</span></div>
                <div className="flex justify-between text-slate-400"><span>Credit Limit:</span> <span className="text-emerald-400 font-bold">{formatCurrency(cust.creditLimit)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Outstanding Due:</span> <span className={`font-bold ${cust.outstanding > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{formatCurrency(cust.outstanding)}</span></div>
              </div>
            </div>

            <button
              onClick={() => setDetailModal(cust)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              View Full Profile & Order History
            </button>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Register New Customer</h3>
            <p className="text-xs text-slate-400 mb-4">Add buyer details to CRM system.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer / Company Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <option value="Wholesale">Wholesale</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Direct">Direct Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
                  <input type="text" required value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
                  <input type="text" required value={formData.gst} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Credit Limit (₹)</label>
                  <input type="number" required value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-500 text-slate-950 rounded-xl shadow-lg">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button onClick={() => setDetailModal(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white mb-2">{detailModal.name}</h3>
            <p className="text-xs text-orange-400 font-semibold mb-4">{detailModal.type} Customer Profile ({detailModal.id})</p>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono">
              <div className="flex justify-between"><span className="text-slate-400">Contact Person:</span> <span className="text-white font-bold">{detailModal.contactPerson}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{detailModal.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-slate-200">{detailModal.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">GST:</span> <span className="text-amber-400 font-bold">{detailModal.gst}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Approved Credit Limit:</span> <span className="text-emerald-400 font-bold">{formatCurrency(detailModal.creditLimit)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Outstanding Balance:</span> <span className="text-rose-400 font-bold">{formatCurrency(detailModal.outstanding)}</span></div>
            </div>

            <button onClick={() => setDetailModal(null)} className="mt-5 w-full py-2 bg-slate-800 text-xs font-semibold rounded-xl">Close Profile</button>
          </div>
        </div>
      )}
    </div>
  );
};
