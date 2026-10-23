import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  X,
  FileCode
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';

export const PurchasesView = () => {
  const { purchaseRequests, addPurchaseRequest, formatCurrency, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePO, setActivePO] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [formData, setFormData] = useState({
    item: '',
    qty: '1,000 kg',
    requestedBy: 'Store Supervisor',
    department: 'Raw Material Store',
    requiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    estimatedCost: ''
  });

  const filteredPurchases = purchaseRequests.filter(pr =>
    (pr.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pr.item || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pr.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.item.trim()) {
      showToast('Please enter an item description.', 'error');
      return;
    }
    if (!formData.estimatedCost || Number(formData.estimatedCost) <= 0) {
      showToast('Please enter a valid estimated cost.', 'error');
      return;
    }

    const payload = {
      ...formData,
      estimatedCost: Number(formData.estimatedCost)
    };

    const created = await addPurchaseRequest(payload);
    setIsModalOpen(false);
    setFormData({
      item: '',
      qty: '1,000 kg',
      requestedBy: 'Store Supervisor',
      department: 'Raw Material Store',
      requiredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedCost: ''
    });

    if (created) {
      setActivePO(created);
      setIsInvoiceOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" /> Purchase Management & PO Requests
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Purchase requests → Supplier quotations → Manager PO approvals → Goods Receipt Note (GRN) & Payments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create Purchase Request
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, item, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Request Ref</th>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-center">Required Qty</th>
                <th className="p-4">Requested By</th>
                <th className="p-4">Department</th>
                <th className="p-4 font-mono">Required Date</th>
                <th className="p-4 text-right">Est. Cost</th>
                <th className="p-4 text-center">PO Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredPurchases.map((pr) => (
                <tr key={pr.id || pr._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{pr.id}</td>
                  <td className="p-4 font-bold text-white">{pr.item}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-300">{pr.qty}</td>
                  <td className="p-4 text-slate-300">{pr.requestedBy}</td>
                  <td className="p-4 text-slate-300">{pr.department}</td>
                  <td className="p-4 font-mono text-slate-400">{pr.requiredDate}</td>
                  <td className="p-4 text-right font-mono font-bold text-emerald-400">{formatCurrency(pr.estimatedCost)}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      pr.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {pr.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setActivePO(pr);
                        setIsInvoiceOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 border border-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-400" />
                      <span>PO Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Purchase Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-400" /> New Purchase Requisition / PO
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Item Description / Raw Material *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Potassium Nitrate (KNO3) 99% Pure"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Required Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2,000 kg or 500 Boxes"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Estimated Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 150000"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Raw Material Store">Raw Material Store</option>
                    <option value="Manufacturing">Manufacturing Unit</option>
                    <option value="Packing Unit">Packing Unit</option>
                    <option value="Maintenance">Maintenance & Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Required Date</label>
                  <input
                    type="date"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Create & Generate PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Invoice Modal */}
      {activePO && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false);
            setActivePO(null);
          }}
          data={activePO}
          type="PURCHASE_ORDER"
        />
      )}
    </div>
  );
};
