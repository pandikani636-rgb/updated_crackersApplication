import React, { useState } from 'react';
import {
  Factory,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  CheckSquare,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductionView = () => {
  const { productionOrders, addProductionOrder, crackers } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    product: crackers[0]?.name || 'Lakshmi Crack',
    plannedQty: 100,
    unit: 'Unit 1 - Sivakasi',
    shift: 'Day Shift A',
    supervisor: 'Ramesh Kumar',
    startDate: new Date().toISOString().split('T')[0]
  });

  const filteredOrders = productionOrders.filter(p => {
    const matchesSearch = p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    'Draft': 'bg-slate-800 text-slate-400',
    'Approved': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'In Production': 'bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse',
    'Quality Check': 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'Completed': 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'Released': 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addProductionOrder(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Factory className="w-6 h-6 text-orange-400" /> Production Management & Batch Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Status Workflow: Draft → Approved → In Production → Quality Check → Completed → Released.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create Production Order
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, product name, or batch number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full md:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Approved">Approved</option>
          <option value="In Production">In Production</option>
          <option value="Quality Check">Quality Check</option>
          <option value="Completed">Completed</option>
          <option value="Released">Released</option>
        </select>
      </div>

      {/* Production Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Batch No</th>
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">Planned Qty</th>
                <th className="p-4 text-center">Produced</th>
                <th className="p-4 text-center">Rejected</th>
                <th className="p-4">Unit & Shift</th>
                <th className="p-4">Supervisor</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{po.id}</td>
                  <td className="p-4 font-mono font-semibold text-slate-300">{po.batchNo}</td>
                  <td className="p-4 font-bold text-white">{po.product}</td>
                  <td className="p-4 text-center font-bold text-blue-400">{po.plannedQty} Bundles</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-400">{po.producedQty} Bundles</td>
                  <td className="p-4 text-center font-mono font-bold text-rose-400">{po.rejectedQty}</td>
                  <td className="p-4 text-slate-300">
                    <span className="block font-semibold">{po.unit}</span>
                    <span className="text-[10px] text-slate-400 block">{po.shift}</span>
                  </td>
                  <td className="p-4 text-slate-300">{po.supervisor}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] ${statusColors[po.status] || 'bg-slate-800 text-slate-300'}`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white mb-1">Create Production Order</h3>
            <p className="text-xs text-slate-400 mb-4">Plan batch production line run.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Item</label>
                  <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    {crackers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Planned Quantity (Bundles)</label>
                  <input type="number" min="1" required value={formData.plannedQty} onChange={(e) => setFormData({ ...formData, plannedQty: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Factory Unit Location</label>
                  <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <option value="Unit 1 - Sivakasi">Unit 1 - Sivakasi</option>
                    <option value="Unit 2 - Virudhunagar">Unit 2 - Virudhunagar</option>
                    <option value="Unit 3 - Madurai">Unit 3 - Madurai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Working Shift</label>
                  <select value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <option value="Day Shift A">Day Shift A</option>
                    <option value="Day Shift B">Day Shift B</option>
                    <option value="Night Shift">Night Shift</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-500 text-slate-950 rounded-xl shadow-lg">Save Production Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
