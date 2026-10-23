import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  UserPlus,
  Phone,
  FileText,
  Package,
  User,
  CheckCircle2,
  List,
  Search,
  Loader2,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';


export const AddagentsView = () => {
  const { showToast, setCurrentTab } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gst: '',
    items: '',
    status: 'Active'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agentsList, setAgentsList] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setIsLoadingTable(true);
    try {
      const res = await axios.get(`${API_URL}/agents`);
      setAgentsList(res.data);
    } catch (err) {
      if (showToast) showToast('Failed to load agents list', 'error');
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      if (showToast) showToast('Agent name is required', 'error');
      return;
    }
    if (!formData.phone.trim()) {
      if (showToast) showToast('Phone number is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/agents`, formData);
      if (showToast) showToast('Agent created successfully!', 'success');
      
      // Reset Form
      setFormData({
        name: '',
        phone: '',
        gst: '',
        items: '',
        status: 'Active'
      });

      // Refresh list
      fetchAgents();
    } catch (err) {
      if (showToast) showToast('Failed to create agent', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this agent?')) return;
    try {
      await axios.delete(`${API_URL}/agents/${id}`);
      if (showToast) showToast('Agent deleted successfully', 'success');
      fetchAgents();
    } catch (err) {
      if (showToast) showToast('Failed to delete agent', 'error');
    }
  };

  const filteredAgents = agentsList.filter(
    (item) =>
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.gst || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.items || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <UserPlus className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Add New Agent
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Register agent details, GST number, assigned items, and contact information.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('Listagents')}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
        >
          <List className="w-4 h-4 text-orange-400" /> View Agent List
        </button>
      </div>

      {/* Form Section */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-800 pb-4 mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" /> Agent Information Entry
            </h3>
            <span className="text-[11px] text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              Required Fields *
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agent Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" /> Agent Name <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>

            {/* GST Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> GST Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 uppercase tracking-wider placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>

            {/* Assigned Items */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-purple-400" /> Assigned Items / Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="items"
                  value={formData.items}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({ name: '', phone: '', gst: '', items: '', status: 'Active' })}
              className="px-5 py-2.5 rounded-xl border border-slate-800 hover:text-white hover:bg-slate-800 hover:border-slate-700 font-semibold text-xs transition-all"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 active:scale-95 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Agent...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Save Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    
    </div>
  );
};
