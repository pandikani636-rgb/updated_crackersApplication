import React from 'react';
import { FileCode2, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BOMView = () => {
  const { bom } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-emerald-400" /> Bill of Materials (BOM) & Formulations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Approved chemical component ratios per bundle, standard material requirement estimations & shortage visibility.
          </p>
        </div>
      </div>

      {/* BOM Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bom.map((b) => (
          <div key={b.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">{b.productCode}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                b.shortage === 'None' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {b.shortage === 'None' ? 'Stock Ready' : b.shortage}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-white">{b.productName}</h3>
              <p className="text-xs text-slate-400">Standard Yield: <span className="text-slate-200 font-semibold">{b.stdUnit}</span></p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Required Chemical Ratios</h4>
              <div className="space-y-1.5 font-mono text-xs">
                {b.components.map((c, i) => (
                  <div key={i} className="flex justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-slate-300 font-sans">{c.rmName}</span>
                    <span className="text-emerald-400 font-bold">{c.qty} {c.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
