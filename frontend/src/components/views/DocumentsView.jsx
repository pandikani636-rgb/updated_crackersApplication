import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Upload,
  Calendar,
  ShieldCheck,
  X,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DocumentsView = () => {
  const { documents, addDocument, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Statutory License',
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    file: null,
    fileName: ''
  });

  const filteredDocs = documents.filter(d =>
    (d.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must not exceed 10 MB.', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      file,
      fileName: file.name,
      title: prev.title || file.name
    }));
    showToast(`File selected: ${file.name} (${Math.round(file.size / 1024)} KB)`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a document title.', 'error');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      expiryDate: formData.expiryDate,
      fileName: formData.fileName || `${formData.title}.pdf`
    };

    await addDocument(payload);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Statutory License',
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      file: null,
      fileName: ''
    });
  };

  const handleDownloadDoc = (doc) => {
    // Generate text/blob file download
    const content = `CrackerHub Vault Document Record\nTitle: ${doc.title}\nCategory: ${doc.category}\nUploaded By: ${doc.uploadedBy}\nExpiry Date: ${doc.expiryDate}\nStatus: ${doc.status}\nReference: ${doc.id || doc._id}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title.endsWith('.pdf') ? doc.title : `${doc.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${doc.title}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-400" /> Document Management Vault
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store & manage statutory PESO permits, GST certificates, supplier agreements, and compliance records.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Upload className="w-4 h-4 stroke-[3]" /> Upload Document
        </button>
      </div>

      {/* Filter */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id || doc._id} className="glass-card p-5 rounded-3xl border border-slate-800 flex items-center justify-between hover:border-orange-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl border border-orange-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">{doc.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{doc.category} • Uploaded by {doc.uploadedBy || 'Admin'}</p>
                <span className="text-[10px] text-amber-400 font-mono block mt-1">Expiry: {doc.expiryDate}</span>
              </div>
            </div>

            <button
              onClick={() => handleDownloadDoc(doc)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-400" /> Upload Statutory Document
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PESO License Renewal Certificate 2026.pdf"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Document Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Statutory License">Statutory License (PESO / Explosives)</option>
                  <option value="Taxation">Taxation (GST / PAN / Income Tax)</option>
                  <option value="Agreement">Supplier / Client Agreement</option>
                  <option value="Safety">Safety & Fire NOC Certificate</option>
                  <option value="Compliance">Quality & Environmental Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Expiry / Renewal Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Select File (PDF, DOCX, JPG, PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-500 file:text-slate-950 hover:file:bg-orange-600"
                />
                {formData.fileName && (
                  <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                    ✓ Attached: {formData.fileName}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  Upload & Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
