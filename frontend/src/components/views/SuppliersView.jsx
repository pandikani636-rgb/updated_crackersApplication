import React, { useState } from 'react';
import {
  Truck,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  Eye,
  IndianRupee,
  X,
  Building2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuppliersView = () => {
  const {
    suppliers,
    addSupplier,
    formatCurrency,
    imports
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contact: '+91 98400 11223',
    email: 'info@supplier.com',
    address: '100 Factory Rd, Sivakasi, TN',
    gst: '33AAACD9999E1Z8',
    terms: 'Net 30',
    notes: 'Primary crackers manufacturer'
  });

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.gst.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.includes(searchTerm)
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addSupplier(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-orange-400" /> Supplier Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain fireworks factory vendors, Sivakasi agencies, GST numbers & payment settlement logs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Supplier
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier by name, GST number, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between hover:border-orange-500/40 transition-all group relative overflow-hidden">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-black text-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-orange-400 transition-colors">{supplier.name}</h3>
                    <p className="text-[11px] font-mono text-slate-400">{supplier.gst}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  supplier.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {supplier.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 my-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" /> {supplier.contact}
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {supplier.email}
                </div>
                <div className="flex items-center gap-2 text-slate-400 truncate">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {supplier.address}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Purchases</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(supplier.totalAmount)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Pending Due</span>
                  <span className={`font-bold ${supplier.pendingAmount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {formatCurrency(supplier.pendingAmount)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setDetailModal(supplier)}
              className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4 text-orange-400" /> View History & Invoices
            </button>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Add New Fireworks Supplier</h3>
            <p className="text-xs text-slate-400 mb-4">Register factory vendor for bulk import tracking.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier / Factory Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sivakasi Crackers Agency"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GST Number</label>
                  <input
                    type="text"
                    required
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Terms</label>
                  <select
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Immediate">Immediate Cash</option>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="50% Advance">50% Advance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Location</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl shadow-lg"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Detail Drawer Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setDetailModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{detailModal.name}</h3>
                <p className="text-xs text-amber-400 font-mono">GST: {detailModal.gst}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs mb-4">
              <div><span className="text-slate-400">Total Purchase:</span> <span className="text-emerald-400 font-bold font-mono block">{formatCurrency(detailModal.totalAmount)}</span></div>
              <div><span className="text-slate-400">Pending Balance:</span> <span className="text-rose-400 font-bold font-mono block">{formatCurrency(detailModal.pendingAmount)}</span></div>
              <div><span className="text-slate-400">Payment Terms:</span> <span className="text-slate-200 block">{detailModal.terms}</span></div>
              <div><span className="text-slate-400">Phone:</span> <span className="text-slate-200 font-mono block">{detailModal.contact}</span></div>
            </div>

            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Import History & Invoices</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {imports.filter(i => i.supplier === detailModal.name).map((imp) => (
                <div key={imp.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-orange-400 font-bold block">{imp.invoiceNo} ({imp.date})</span>
                    <span className="text-slate-400">{imp.bundles} Bundles {imp.cracker}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{formatCurrency(imp.totalAmount)}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setDetailModal(null)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
            >
              Close History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
