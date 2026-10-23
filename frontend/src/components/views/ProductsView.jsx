import React, { useState } from 'react';
import { Boxes, Search, Plus, IndianRupee, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductsView = () => {
  const { crackers, formatCurrency } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = crackers.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-orange-400" /> Product Master & Pricing Tiers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            SKUs, category, pack sizes, MRP, wholesale pricing tiers, tax & box specifications.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product SKU, product name, or category..."
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
                <th className="p-4">SKU Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Pack Size</th>
                <th className="p-4 text-center">Units / Box</th>
                <th className="p-4 text-right">MRP</th>
                <th className="p-4 text-right">Wholesale Price</th>
                <th className="p-4 text-right">Bundle Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 font-mono">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-amber-400">{p.sku}</td>
                  <td className="p-4 font-sans font-bold text-white">{p.name}</td>
                  <td className="p-4 font-sans text-slate-300">{p.category}</td>
                  <td className="p-4 text-center text-slate-300">{p.packetsPerBundle} pkts</td>
                  <td className="p-4 text-center text-slate-300">{p.unitsPerBox} Units</td>
                  <td className="p-4 text-right text-slate-400 line-through">{formatCurrency(p.mrp)}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">{formatCurrency(p.wholesalePrice)}</td>
                  <td className="p-4 text-right font-black text-orange-400">{formatCurrency(p.pricePerBundle)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
