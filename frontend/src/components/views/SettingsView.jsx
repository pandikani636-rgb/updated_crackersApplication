import React, { useState } from 'react';
import {
  Settings,
  Store,
  User,
  Lock,
  FileText,
  Save,
  CheckCircle2,
  Shield,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView = () => {
  const { user, setUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('shop'); // 'shop' | 'profile' | 'security' | 'reports'

  // Form states
  const [shopInfo, setShopInfo] = useState({
    shopName: 'CrackerHub – Crackers Shop Management',
    ownerName: 'Admin Owner',
    phone: '+91 98421 00000',
    email: 'contact@crackerhub.com',
    address: '124 Fireworks Bazaar, Sivakasi Main Road, TN - 626123',
    gstNumber: '33AAAAA0000A1Z5'
  });

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar
  });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: ''
  });

  const [reportConfig, setReportConfig] = useState({
    headerTitle: 'CrackerHub Official Audit Statement',
    currency: '₹ INR',
    showLogo: true
  });

  const handleSaveShop = (e) => {
    e.preventDefault();
    showToast('Shop Information settings saved!', 'success');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser({ ...user, name: profileData.name, email: profileData.email });
    showToast('Admin Profile updated successfully!', 'success');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirmPass) {
      showToast('New passwords do not match!', 'error');
      return;
    }
    showToast('Admin password changed successfully!', 'success');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-400" /> Settings & Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure shop information, admin credentials, security policies, and report headers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'shop'
              ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Store className="w-4 h-4" /> Shop Information
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" /> Admin Profile
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Session
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reports'
              ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Report Header Settings
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'shop' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-2xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Shop & Business Information</h3>
          <form onSubmit={handleSaveShop} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shop Name</label>
                <input
                  type="text"
                  required
                  value={shopInfo.shopName}
                  onChange={(e) => setShopInfo({ ...shopInfo, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={shopInfo.ownerName}
                  onChange={(e) => setShopInfo({ ...shopInfo, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={shopInfo.phone}
                  onChange={(e) => setShopInfo({ ...shopInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shop Email</label>
                <input
                  type="email"
                  required
                  value={shopInfo.email}
                  onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">GST Registration Number</label>
                <input
                  type="text"
                  required
                  value={shopInfo.gstNumber}
                  onChange={(e) => setShopInfo({ ...shopInfo, gstNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Shop Full Address</label>
                <textarea
                  rows="2"
                  value={shopInfo.address}
                  onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Shop Details
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Admin Account Profile</h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profileData.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/50"
              />
              <button
                type="button"
                onClick={() => showToast('Avatar updated!', 'info')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                disabled
                value={profileData.role}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Security & Credentials</h3>
          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Shield className="w-4 h-4" /> Change Password
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 max-w-xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">Report Header & Formatting Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Report Header Title</label>
              <input
                type="text"
                value={reportConfig.headerTitle}
                onChange={(e) => setReportConfig({ ...reportConfig, headerTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Report Currency Symbol</label>
              <input
                type="text"
                disabled
                value={reportConfig.currency}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-400"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('Report Header settings saved!', 'success')}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Update Header Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
