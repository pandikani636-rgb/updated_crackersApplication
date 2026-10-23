import React, { useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Tag,
  Calendar,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadExcel, downloadPDF } from '../../utils/exportUtils';

export const ShopItemsView = () => {
  const { shopItems, addShopItem, deleteShopItem, updateShopItem, formatCurrency, requestConfirm, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const todayDateStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    date: todayDateStr
  });

  const filteredItems = shopItems.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      cost: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      cost: item.cost,
      date: item.date || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }
    if (!formData.cost || Number(formData.cost) <= 0) {
      showToast('Please enter a valid cost amount', 'error');
      return;
    }

    if (editingItem) {
      await updateShopItem(editingItem._id || editingItem.id, formData);
    } else {
      await addShopItem(formData);
    }
    setIsModalOpen(false);
  };

  const handleDownloadExcel = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'name' },
      { header: 'Cost (₹)', key: 'cost' }
    ];
    downloadExcel('Shop_Items_Master_Report', 'Shop Items', cols, filteredItems);
    showToast('Shop Items list downloaded as Excel!', 'success');
  };

  const handleDownloadPDF = () => {
    const cols = [
      { header: 'Date', key: 'date' },
      { header: 'Item Name', key: 'name' },
      { header: 'Cost (₹)', key: 'cost' }
    ];
    downloadPDF('Shop_Items_Master_Report', 'Shop Items Master Catalog', cols, filteredItems, {
      'Total Items': filteredItems.length
    });
    showToast('Shop Items catalog downloaded as PDF!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-orange-400" /> Item Master Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Register shop item names and default costs stored in database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExcel}
            className="px-3.5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs rounded-xl border border-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-orange-400" /> PDF Report
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add New Item Name
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Item Name</th>
                <th className="p-4 text-right">Cost (₹)</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 font-medium">
                    No shop items registered yet. Click "Add New Item Name" to create one.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-medium text-slate-400">{item.date || '2026-08-20'}</td>
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Tag className="w-4 h-4 text-orange-400 shrink-0" />
                      {item.name}
                    </td>
                    <td className="p-4 text-right font-mono font-black text-emerald-400 text-sm">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Item"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            requestConfirm({
                              title: 'Delete Shop Item?',
                              message: `Are you sure you want to remove item "${item.name}" from database catalog?`,
                              onConfirm: () => deleteShopItem(item._id || item.id)
                            });
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black tracking-tight text-white mb-1 flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-400" />
              {editingItem ? 'Edit Shop Item' : 'Add Item Name & Cost'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">Enter shop item name and cost to store in database.</p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Entry Date</label>
                <input
                  type="date"
                  required
                  max={todayDateStr}
                  value={formData.date}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val > todayDateStr) {
                      showToast('Future dates are not allowed', 'warning');
                      setFormData({ ...formData, date: todayDateStr });
                    } else {
                      setFormData({ ...formData, date: val });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lakshmi Crack, Sanguchakra, Sparklers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Cost Amount (₹)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="e.g. 4500"
                  value={formData.cost}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value.replace(/[^0-9.]/g, '') })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 rounded-xl shadow-lg shadow-orange-500/20"
                >
                  {editingItem ? 'Update Item' : 'Save Item to DB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
