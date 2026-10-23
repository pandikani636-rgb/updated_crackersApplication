import React from 'react';
import { CheckSquare, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ApprovalsView = () => {
  const { approvals, approvePendingTask } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-orange-400" /> Multi-Tier Approval Workflow Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Purchase Request → Manager Approval; Production Plan → Factory Manager Approval; Stock Adjustments → Store Manager Approval.
          </p>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Approval ID</th>
                <th className="p-4">Module</th>
                <th className="p-4">Ref Number</th>
                <th className="p-4">Requested By</th>
                <th className="p-4">Item Details / Value</th>
                <th className="p-4">Requested Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {approvals.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{app.id}</td>
                  <td className="p-4 font-bold text-white">{app.module}</td>
                  <td className="p-4 font-mono text-slate-300">{app.refNo}</td>
                  <td className="p-4 font-medium text-slate-300">{app.requestedBy}</td>
                  <td className="p-4 text-slate-200">{app.item}</td>
                  <td className="p-4 font-mono text-slate-400">{app.requestedDate}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {app.status === 'Pending Approval' ? (
                      <button
                        onClick={() => approvePendingTask(app.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-md transition-all"
                      >
                        Approve Now
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
