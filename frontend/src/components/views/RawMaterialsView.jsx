import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  Flame,
  Layers,
  MapPin,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RawMaterialsView = () => {
  const { rawMaterials, addRawMaterial, formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Oxidizers',
    currentStock: 1000,
    minStock: 200,
    unit: 'kg',
    costPerUnit: 120,
    location: 'Godown A-1',
    hazardClass: 'Class 5.1'
  });

  const filteredMaterials = rawMaterials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter ? m.category === categoryFilter : true;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(rawMaterials.map(m => m.category)));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addRawMaterial(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" /> Raw Material Master & Chemical Stock
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Oxidizers, Fuels, Color Agents, Visco Fuses, storage vault locations & controlled hazard classes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Raw Material
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search material code, chemical name, or hazard class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full md:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Material Code</th>
                <th className="p-4">Chemical Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4 text-center">Min Threshold</th>
                <th className="p-4 text-right">Cost / Unit</th>
                <th className="p-4">Storage Location</th>
                <th className="p-4">Hazard Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredMaterials.map((rm) => (
                <tr key={rm.code} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{rm.code}</td>
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    {rm.name}
                  </td>
                  <td className="p-4 font-medium text-slate-300">{rm.category}</td>
                  <td className="p-4 text-center font-mono font-black text-emerald-400 text-sm">
                    {rm.currentStock.toLocaleString('en-IN')} {rm.unit}
                  </td>
                  <td className="p-4 text-center font-mono text-slate-400">{rm.minStock} {rm.unit}</td>
                  <td className="p-4 text-right font-mono text-slate-300">{formatCurrency(rm.costPerUnit)} / {rm.unit}</td>
                  <td className="p-4 font-medium text-blue-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {rm.location}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {rm.hazardClass}
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
            <h3 className="text-lg font-bold text-white mb-1">Add Raw Material Entry</h3>
            <p className="text-xs text-slate-400 mb-4">Register chemical compound or fuse wire.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Material Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Barium Nitrate" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <option value="Oxidizers">Oxidizers</option>
                    <option value="Fuels">Fuels</option>
                    <option value="Sparklers / Effect">Sparklers / Effect</option>
                    <option value="Color Agents">Color Agents</option>
                    <option value="Ignition Systems">Ignition Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Opening Stock</label>
                  <input type="number" required value={formData.currentStock} onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Unit of Measure</label>
                  <input type="text" required value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="kg / meters" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost per Unit (₹)</label>
                  <input type="number" required value={formData.costPerUnit} onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Storage Location</label>
                  <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Godown A-1" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-500 text-slate-950 rounded-xl shadow-lg">Save Raw Material</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
