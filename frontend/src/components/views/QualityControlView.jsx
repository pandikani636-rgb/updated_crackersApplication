import React, { useState } from 'react';
import { ShieldCheck, Search, Plus, CheckCircle2, AlertTriangle, XCircle, RefreshCw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QualityControlView = () => {
  const { qcRecords, addQCRecord } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    batchNo: 'BATCH-2026-LC09',
    product: 'Lakshmi Crack',
    sampleSize: 100,
    passedQty: 95,
    rejectedQty: 5,
    defectType: 'Fuse Delay / Moisture',
    inspector: 'Priya Dharshini (QC Lead)',
    decision: 'Passed & Released'
  });

  const filteredQC = qcRecords.filter(q =>
    q.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.inspector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addQCRecord(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Quality Control (QC) & Inspection
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Batch sample testing, pass/fail decisions, defect classification & rework/rejection approvals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log QC Inspection
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batch number, product, or inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* QC Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Batch Number</th>
                <th className="p-4">Product Name</th>
                <th className="p-4 text-center">Sample Tested</th>
                <th className="p-4 text-center">Passed Qty</th>
                <th className="p-4 text-center">Rejected Qty</th>
                <th className="p-4">Defect Classification</th>
                <th className="p-4">Inspector</th>
                <th className="p-4 text-center">QC Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredQC.map((q) => (
                <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400">{q.batchNo}</td>
                  <td className="p-4 font-bold text-white">{q.product}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-300">{q.sampleSize} Pkts</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-400">{q.passedQty}</td>
                  <td className="p-4 text-center font-mono font-bold text-rose-400">{q.rejectedQty}</td>
                  <td className="p-4 font-medium text-slate-300">{q.defectType}</td>
                  <td className="p-4 text-slate-300">{q.inspector}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] ${
                      q.decision.includes('Pass') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {q.decision}
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
            <h3 className="text-lg font-bold text-white mb-1">File QC Inspection Report</h3>
            <p className="text-xs text-slate-400 mb-4">Record sample test result and decision.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Batch Number</label>
                  <input type="text" required value={formData.batchNo} onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product</label>
                  <input type="text" required value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sample Size Tested</label>
                  <input type="number" required value={formData.sampleSize} onChange={(e) => setFormData({ ...formData, sampleSize: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Passed Quantity</label>
                  <input type="number" required value={formData.passedQty} onChange={(e) => setFormData({ ...formData, passedQty: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">QC Decision</label>
                  <select value={formData.decision} onChange={(e) => setFormData({ ...formData, decision: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <option value="Passed & Released">Passed & Released</option>
                    <option value="Pass with Warning">Pass with Warning</option>
                    <option value="Rework Required">Rework Required</option>
                    <option value="Scrapped / Rejected">Scrapped / Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Defect Classification</label>
                  <input type="text" value={formData.defectType} onChange={(e) => setFormData({ ...formData, defectType: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold bg-orange-500 text-slate-950 rounded-xl shadow-lg">Save QC Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
