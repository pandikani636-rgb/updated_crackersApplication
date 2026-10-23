import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/api';
import {
  Users,
  Building,
  Coins,
  Layers,
  Sparkles,
  Warehouse,
  Calendar,
  UserPlus,
  Briefcase,
  Check,
  CheckCircle2,
  Trash2,
  Search,
  Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';


export const AddworkersView = () => {
  const { showToast, setCurrentTab, theme } = useApp();

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDepts, setSelectedDepts] = useState([]);
  const [deptCounts, setDeptCounts] = useState({
    Office: '', Money: '', Set: '', Finishing: '', Godown: ''
  });
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [isSaving, setIsSaving] = useState(false);

  // Table data from backend
  const [allocationsTable, setAllocationsTable] = useState([]);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [tableSearch, setTableSearch] = useState('');

  const departments = [
    { id: 'Office',   label: 'Office',    icon: Building, color: 'from-blue-500 to-indigo-600' },
    { id: 'Money',    label: 'Money',     icon: Coins,    color: 'from-emerald-500 to-teal-600' },
    { id: 'Set',      label: 'Set',       icon: Layers,   color: 'from-amber-500 to-orange-600' },
    { id: 'Finishing',label: 'Finishing', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { id: 'Godown',   label: 'Godown',    icon: Warehouse,color: 'from-rose-500 to-red-600' }
  ];

  // Fetch allocations from backend on mount
  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setIsLoadingTable(true);
    try {
      const res = await axios.get(`${API_URL}/workerAllocations`);
      setAllocationsTable(res.data);
    } catch {
      if (showToast) showToast('Failed to load allocation records', 'error');
    }
    setIsLoadingTable(false);
  };

  const toggleDepartment = (deptId) => {
    setSelectedDepts((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  };

  const handleSelectAll = () => {
    setSelectedDepts(
      selectedDepts.length === departments.length ? [] : departments.map((d) => d.id)
    );
  };

  const handleCountChange = (deptId, value) => {
    setDeptCounts((prev) => ({ ...prev, [deptId]: value.replace(/\D/g, '') }));
  };

  const totalWorkersCount = selectedDepts.reduce((sum, deptId) => {
    const val = parseInt(deptCounts[deptId], 10);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDepts.length === 0) {
      if (showToast) showToast('Please select at least one department', 'error');
      return;
    }

    const missingCounts = selectedDepts.filter(
      (deptId) => !deptCounts[deptId] || Number(deptCounts[deptId]) <= 0
    );
    if (missingCounts.length > 0) {
      if (showToast) showToast(`Enter worker count for: ${missingCounts.join(', ')}`, 'error');
      return;
    }

    setIsSaving(true);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      // Save single record per date containing office, money, set, finishing, godown counts
      const res = await axios.post(`${API_URL}/workerAllocations`, {
        id: `ALC-${Math.floor(100 + Math.random() * 900)}`,
        date: selectedDate,
        time: currentTime,
        office: parseInt(deptCounts['Office'] || 0, 10),
        money: parseInt(deptCounts['Money'] || 0, 10),
        set: parseInt(deptCounts['Set'] || 0, 10),
        finishing: parseInt(deptCounts['Finishing'] || 0, 10),
        godown: parseInt(deptCounts['Godown'] || 0, 10)
      });

      // Prepend newly saved record to local table state
      setAllocationsTable((prev) => [res.data, ...prev]);

      if (showToast) {
        showToast(
          `Saved ${totalWorkersCount} workers on date ${selectedDate} to database!`,
          'success'
        );
      }

      // Reset form
      setSelectedDepts([]);
      setDeptCounts({ Office: '', Money: '', Set: '', Finishing: '', Godown: '' });
      setSelectedDate(getTodayDate());
    } catch {
      if (showToast) showToast('Failed to save allocations. Check backend connection.', 'error');
    }
    setIsSaving(false);
  };

  const handleDeleteRecord = async (recordId) => {
    try {
      await axios.delete(`${API_URL}/workerAllocations/${recordId}`);
      setAllocationsTable((prev) => prev.filter((item) => item._id !== recordId));
      if (showToast) showToast('Record deleted', 'info');
    } catch {
      if (showToast) showToast('Failed to delete record', 'error');
    }
  };

  const filteredTable = allocationsTable.filter((item) => {
    const q = tableSearch.toLowerCase();
    return (
      (item.department || '').toLowerCase().includes(q) ||
      (item.id || '').toLowerCase().includes(q) ||
      (item.date || '').includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/20">
            <UserPlus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Add & Assign Workers</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select departments, enter worker counts, and save to database.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab && setCurrentTab('Listworkers')}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Users className="w-4 h-4 text-orange-400" />
          View Workers Directory
        </button>
      </div>

      {/* Half-page Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT — Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5">

          {/* Allocation Date */}
          <div className={`p-4 rounded-2xl border transition-colors ${
            theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                Allocation Date <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setSelectedDate(getTodayDate())}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-semibold"
              >
                Set Today
              </button>
            </div>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                colorScheme: theme === 'light' ? 'light' : 'dark',
                backgroundColor: theme === 'light' ? '#ffffff' : '#020617',
                color: theme === 'light' ? '#0f172a' : '#ffffff'
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-orange-500 transition-all cursor-pointer ${
                theme === 'light' ? 'border border-slate-300' : 'border border-slate-700'
              }`}
            />
          </div>

          {/* Department Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-400" />
                Select Departments & Enter Workers
              </label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleSelectAll}
                  className="text-xs text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                  {selectedDepts.length === departments.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                  {selectedDepts.length}/{departments.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col space-y-2.5">
              {departments.map((dept) => {
                const Icon = dept.icon;
                const isSelected = selectedDepts.includes(dept.id);
                const currentCount = deptCounts[dept.id] || '';
                return (
                  <div key={dept.id}
                    className={`flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/70 ring-1 ring-orange-500/40'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Top row */}
                    <div
                      onClick={() => toggleDepartment(dept.id)}
                      className="flex items-center gap-3.5 px-4 py-3 cursor-pointer select-none"
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'bg-orange-500 text-slate-950' : 'border-2 border-slate-600 bg-slate-950 text-transparent'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className={`p-2 rounded-xl bg-gradient-to-tr ${dept.color} text-white shadow-sm shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {dept.label}
                      </span>
                      {!isSelected && (
                        <span className="ml-auto text-xs text-slate-500">Click to select</span>
                      )}
                    </div>

                    {/* Input inside box when selected */}
                    {isSelected && (
                      <div className="px-4 pb-3 animate-fade-in">
                        <div className="flex items-center gap-2 pl-[3.25rem]">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            placeholder="No. of workers"
                            value={currentCount}
                            onChange={(e) => handleCountChange(dept.id, e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-orange-500/60 rounded-xl text-xs font-mono font-bold text-orange-400 placeholder-slate-500 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                          />
                          <span className="text-xs font-bold text-orange-400 font-mono shrink-0">Staff</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedDepts([]);
                setDeptCounts({ Office: '', Money: '', Set: '', Finishing: '', Godown: '' });
                setSelectedDate(getTodayDate());
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={selectedDepts.length === 0 || isSaving}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                selectedDepts.length > 0 && !isSaving
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-orange-500/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Save workers</>
              )}
            </button>
          </div>
        </form>

        {/* RIGHT — Live Summary */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 h-fit">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-orange-400" />
            Allocation Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Date:</span>
              <span className="font-bold text-slate-200">{selectedDate}</span>
            </div>
            {selectedDepts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No departments selected. Click any department to begin.
              </p>
            ) : (
              selectedDepts.map((deptId) => {
                const dept = departments.find((d) => d.id === deptId);
                const Icon = dept ? dept.icon : Building;
                const count = deptCounts[deptId];
                return (
                  <div key={deptId} className={`flex items-center justify-between transition-colors ${
            theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-950/80 border-slate-800'} px-3 py-2.5 rounded-xl border border-slate-800/80`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${dept?.color} text-white`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">{deptId}</span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${count ? 'text-orange-400' : 'text-slate-500 italic'}`}>
                      {count ? `${count} Staff` : 'Pending...'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          {selectedDepts.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-semibold">Total Workers:</span>
              <span className="text-base font-black text-emerald-400 font-mono">{totalWorkersCount} Workers</span>
            </div>
          )}
        </div>
      </div>

      {/* Saved Allocations Table from DB */}
      
    </div>
  );
};