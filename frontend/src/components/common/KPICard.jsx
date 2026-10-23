import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const KPICard = ({ title, value, description, icon: Icon, change, isPositive = true, accent = 'orange' }) => {
  const accentGradients = {
    orange: 'from-orange-500/20 to-amber-500/5 text-orange-400 border-orange-500/30',
    amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    blue: 'from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/30',
    rose: 'from-rose-500/20 to-red-500/5 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-violet-500/5 text-purple-400 border-purple-500/30'
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${accentGradients[accent]} opacity-30 blur-2xl group-hover:opacity-50 transition-opacity`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-100 mt-2 tracking-tight">{value}</h3>
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-md text-slate-200 group-hover:scale-110 transition-transform ${accentGradients[accent].split(' ')[2]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs">
        <span className="text-slate-400 truncate max-w-[170px]">{description}</span>
        {change && (
          <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
