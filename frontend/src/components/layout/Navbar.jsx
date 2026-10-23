import React, { useState } from 'react';
import {
  Search,
  Bell,
  Plus,
  Calendar,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  Shield,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const {
    user,
    userRole,
    setUserRole,
    theme,
    toggleTheme,
    mobileMenuOpen,
    setMobileMenuOpen,
    sidebarCollapsed,
    globalSearch,
    setGlobalSearch,
    notifications,
    setCurrentTab,
    handleLogout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles = [
    'Super Admin',
    'Factory Manager',
    'Production Manager',
    'Store Manager',
    'Sales Manager',
    'Accounts',
    'QC Staff'
  ];

  const todayString = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-18 transition-all duration-300 border-b ${
        sidebarCollapsed ? 'left-0 md:left-20' : 'left-0 md:left-64'
      } ${
        theme === 'light' ? 'bg-white/95 border-slate-200 text-slate-800 shadow-sm' : 'bg-slate-950/80 border-slate-800/80 text-slate-100 backdrop-blur-md'
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Mobile Hamburger & Left Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-orange-400" />}
          </button>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, CRM, POs, drivers..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-orange-500 transition-all bg-slate-900/90 border border-slate-800 text-slate-200"
            />
          </div>
        </div>

        {/* Right Action Icons & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all transform active:scale-95 ${
              theme === 'dark'
                ? 'bg-slate-900 border-amber-500/30 text-amber-400 hover:bg-slate-800'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-600 hover:bg-amber-500/20'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Role Switcher Pill */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-orange-400 hover:border-slate-700 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-10 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs">
                <p className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch View Role</p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setUserRole(r); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                      userRole === r ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date Badge */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span>{todayString}</span>
          </div>

          {/* Notification Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-400" /> System Notifications
                  </h4>
                  <span className="text-[10px] text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    {unreadCount} New
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto my-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.link) setCurrentTab(item.link);
                        setShowNotifications(false);
                      }}
                      className={`p-3 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer flex items-start gap-3 ${
                        !item.read ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                        {item.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                        {item.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{item.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-orange-500/40"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">{user.name}</p>
                <p className="text-[10px] text-orange-400 leading-tight font-semibold">{userRole}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-52 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-slate-200">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { setCurrentTab('Settings'); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Account Settings
                </button>
                <button
                  onClick={() => { handleLogout(); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                >
                  Logout Session
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
