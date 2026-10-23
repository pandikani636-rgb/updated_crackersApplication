import React, { useState } from 'react';
import { Flame, ShieldAlert, AlertTriangle, CheckCircle2, Calendar, FileText, Plus, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SafetyView = () => {
  const { safetyRecords, addSafetyRecord } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Equipment Check',
    inspectionDate: new Date().toISOString().split('T')[0],
    nextDueDate: '2026-09-30',
    inspector: 'Manoj Kumar (Safety Officer)'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addSafetyRecord(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500 animate-pulse" /> Safety & Statutory Compliance Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            PESO Explosives Storage Licenses (LE-1), fire hydrant audits, static grounding tests & safety training drills.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Safety Record
        </button>
      </div>

      {/* Safety Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safetyRecords.map((s) => (
          <div key={s.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">{s.id}</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                s.status === 'Compliant' || s.status === 'Completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
              }`}>
                {s.status}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Category: <span className="text-slate-200 font-semibold">{s.category}</span></p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
              <div><span className="text-slate-500 uppercase text-[10px] font-bold block">Inspected On</span><span className="text-slate-300">{s.inspectionDate}</span></div>
              <div><span className="text-slate-500 uppercase text-[10px] font-bold block">Next Expiry / Due</span><span className="text-amber-400 font-bold">{s.nextDueDate}</span></div>
            </div>
            <p className="text-[11px] text-slate-400">Certified Officer: <span className="text-slate-200 font-semibold">{s.inspector}</span></p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"><X className="w-5 h-5" /></button>
            <h3 className="text-lg font-bold text-white mb-1">Add Safety / Compliance Audit</h3>
            <p className="text-xs text-slate-400 mb-4">Record statutory license or equipment test.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Record Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. PESO License Renewal Form LE-1" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                  <option value="Statutory License">Statutory License (PESO / Fire NOC)</option>
                  <option value="Equipment Check">Equipment Check (Hydrants / Extinguishers)</option>
                  <option value="Electrical Safety">Electrical Safety (Static Earthing)</option>
                  <option value="Training">Training & Emergency Drill</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Next Renewal / Expiry Due Date</label>
                <input type="date" required value={formData.nextDueDate} onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl shadow-lg">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
