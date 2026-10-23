import React, { useState } from 'react';
import { Truck, Search, Plus, CheckCircle2, Clock, MapPin, FileCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DispatchView = () => {
  const { dispatchOrders, addDispatchOrder } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    orderId: 'ORD-9985',
    customer: 'City Wholesale Bazaar',
    transporter: 'Sivakasi Express Logistics',
    vehicleNo: 'TN-67-X-8811',
    driverName: 'R. Periasamy',
    destination: 'Salem Industrial Market',
    dispatchDate: new Date().toISOString().split('T')[0]
  });

  const filteredDispatch = dispatchOrders.filter(d =>
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addDispatchOrder(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" /> Dispatch & Delivery Logistics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch challans, vehicle & driver tracking, destination hubs, and Proof-of-Delivery (POD) records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Create Dispatch Order
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Customer, Transporter, or Vehicle No..."
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
                <th className="p-4">Dispatch Ref</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Transporter & Driver</th>
                <th className="p-4">Vehicle No</th>
                <th className="p-4">Destination</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">POD Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredDispatch.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{d.id}</td>
                  <td className="p-4 font-mono font-bold text-orange-400">{d.orderId}</td>
                  <td className="p-4 font-semibold text-white">{d.customer}</td>
                  <td className="p-4 text-slate-300">
                    <span className="block font-bold">{d.transporter}</span>
                    <span className="text-[10px] text-slate-400 block">Driver: {d.driverName}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-200">{d.vehicleNo}</td>
                  <td className="p-4 text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" /> {d.destination}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      d.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-400 text-[11px]">{d.podStatus}</td>
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
            <h3 className="text-lg font-bold text-white mb-1">Create Dispatch Shipment</h3>
            <p className="text-xs text-slate-400 mb-4">Assign transporter and generate delivery challan.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Order Ref ID</label>
                  <input type="text" required value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer</label>
                  <input type="text" required value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Transporter Agency</label>
                  <input type="text" required value={formData.transporter} onChange={(e) => setFormData({ ...formData, transporter: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Registration No</label>
                  <input type="text" required value={formData.vehicleNo} onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driver Name</label>
                  <input type="text" required value={formData.driverName} onChange={(e) => setFormData({ ...formData, driverName: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Hub</label>
                  <input type="text" required value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-500 text-slate-950 rounded-xl shadow-lg">Save & Issue Challan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
