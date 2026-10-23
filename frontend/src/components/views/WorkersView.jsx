import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  UserCheck,
  Calendar,
  Phone,
  IndianRupee,
  X,
  Grid,
  List,
  Briefcase
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkersView = () => {
  const {
    workers,
    addWorker,
    editWorker,
    formatCurrency,
    requestConfirm,
    presentWorkersCount
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [profileDrawer, setProfileDrawer] = useState(null);

  const todayDateStr = new Date().toISOString().split('T')[0];

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    role: 'Store Supervisor',
    salary: 22000,
    status: 'Active',
    address: '12 Market Rd, Sivakasi'
  });

  const activeWorkersCount = workers.filter((w) => w.status === 'Active').length;
  const onLeaveCount = workers.filter((w) => w.status === 'On Leave').length;

  const roles = Array.from(new Set(workers.map((w) => w.role)));

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm);
    const matchesRole = roleFilter ? w.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setEditingWorker(null);
    setFormData({
      name: '',
      phone: '+91 98900 12345',
      joinDate: new Date().toISOString().split('T')[0],
      role: 'Store Supervisor',
      salary: 22000,
      status: 'Active',
      address: '44 Main St, City'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (worker) => {
    setEditingWorker(worker);
    setFormData({ ...worker });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingWorker) {
      editWorker({ ...formData, id: editingWorker.id });
    } else {
      addWorker(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Worker Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage store employees, staff roles, contact phone numbers & monthly salary structures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Worker
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Workers</p>
            <h3 className="text-xl font-black text-white mt-1">{workers.length} Staff</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Active Workers</p>
            <h3 className="text-xl font-black text-emerald-400 mt-1">{activeWorkersCount} Active</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">On Leave</p>
            <h3 className="text-xl font-black text-amber-400 mt-1">{onLeaveCount} Worker</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase font-semibold">Today's Present</p>
            <h3 className="text-xl font-black text-orange-400 mt-1">
              {presentWorkersCount} / {workers.length}
            </h3>
          </div>
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl border border-orange-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search worker by name, EMP ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-orange-500 w-full md:w-auto"
        >
          <option value="">All Roles</option>
          {roles.map((r, i) => (
            <option key={i} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Worker List / Grid Render */}
      {viewMode === 'table' ? (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Worker Name</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Joining Date</th>
                  <th className="p-4 text-right">Monthly Salary</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{worker.id}</td>
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-xs border border-orange-500/30">
                        {worker.name.charAt(0)}
                      </div>
                      {worker.name}
                    </td>
                    <td className="p-4 font-mono text-slate-300">{worker.phone}</td>
                    <td className="p-4 font-semibold text-slate-300">{worker.role}</td>
                    <td className="p-4 font-mono text-slate-400">{worker.joinDate}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(worker.salary)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        worker.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setProfileDrawer(worker)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(worker)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkers.map((w) => (
            <div key={w.id} className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4 hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{w.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  w.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {w.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                  {w.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">{w.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Briefcase className="w-3 h-3 text-orange-400" /> {w.role}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400"><span>Phone:</span> <span className="text-slate-200">{w.phone}</span></div>
                <div className="flex justify-between text-slate-400"><span>Salary:</span> <span className="text-emerald-400 font-bold">{formatCurrency(w.salary)}</span></div>
                <div className="flex justify-between text-slate-400"><span>Joined:</span> <span className="text-slate-300">{w.joinDate}</span></div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setProfileDrawer(w)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleOpenEditModal(w)}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Worker Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingWorker ? 'Edit Worker Profile' : 'Add New Employee'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Enter staff member details for payroll and attendance tracking.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Worker Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Store Supervisor">Store Supervisor</option>
                    <option value="Inventory Handler">Inventory Handler</option>
                    <option value="Packaging Specialist">Packaging Specialist</option>
                    <option value="Dispatch Loader">Dispatch Loader</option>
                    <option value="Accounts Assistant">Accounts Assistant</option>
                    <option value="Forklift Operator">Forklift Operator</option>
                    <option value="Security & Safety">Security & Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Basic Salary (₹)</label>
                  <input
                    type="number"
                    min="5000"
                    required
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Joining Date</label>
                  <input
                    type="date"
                    required
                    max={todayDateStr}
                    value={formData.joinDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val > todayDateStr) {
                        setFormData({ ...formData, joinDate: todayDateStr });
                      } else {
                        setFormData({ ...formData, joinDate: val });
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 rounded-xl shadow-lg"
                >
                  {editingWorker ? 'Update Worker' : 'Save Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Worker Profile Drawer Modal */}
      {profileDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setProfileDrawer(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-4 border-b border-slate-800 mb-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 font-black text-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-2">
                {profileDrawer.name.charAt(0)}
              </div>
              <h3 className="text-xl font-extrabold text-white">{profileDrawer.name}</h3>
              <p className="text-xs text-orange-400 font-semibold">{profileDrawer.role} ({profileDrawer.id})</p>
            </div>

            <div className="space-y-2 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="font-mono text-slate-200">{profileDrawer.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Address:</span> <span className="text-slate-300">{profileDrawer.address}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Joined Date:</span> <span className="text-slate-200">{profileDrawer.joinDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Monthly Basic Salary:</span> <span className="font-mono text-emerald-400 font-bold">{formatCurrency(profileDrawer.salary)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Attendance Rate (Aug):</span> <span className="font-bold text-amber-400">96.1% (25/26 Days)</span></div>
            </div>

            <button
              onClick={() => setProfileDrawer(null)}
              className="mt-5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
