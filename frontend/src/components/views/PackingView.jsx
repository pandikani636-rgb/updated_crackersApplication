import React from 'react';
import { Package, Boxes, CheckCircle2, Tag, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PackingView = () => {
  const { packingOrders } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-400" /> Packing & Box Labeling Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Packing material stock, box/pack quantity tracking, batch labels, manufacturing dates & repacking.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packingOrders.map((pkg) => (
          <div key={pkg.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">{pkg.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {pkg.status}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-white">{pkg.product}</h3>
            <p className="text-xs text-slate-400 font-mono">Batch Reference: <span className="text-slate-200 font-bold">{pkg.batchNo}</span></p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div><span className="text-slate-500 uppercase text-[10px] font-bold block">Packed Boxes</span><span className="text-emerald-400 font-bold">{pkg.packedBoxes} / {pkg.targetBoxes}</span></div>
              <div><span className="text-slate-500 uppercase text-[10px] font-bold block">Box Size</span><span className="text-slate-300">{pkg.boxSize}</span></div>
            </div>

            <p className="text-[11px] text-slate-400">Supervisor: <span className="text-slate-200 font-semibold">{pkg.supervisor}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};
