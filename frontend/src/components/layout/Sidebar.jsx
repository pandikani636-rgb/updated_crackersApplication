import React, { useState, useEffect } from 'react';
import {
  Flame,
  LayoutDashboard,
  Receipt,
  Users,
  Boxes,
  ArrowUpRight,
  Truck,
  Factory,
  ArrowDownLeft,
  ShoppingBag,
  Building2,
  CalendarCheck,
  CreditCard,
  ShieldAlert,
  CheckSquare,
  FileText,
  Shield,
  BarChart3,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserPlus,
  ClipboardList,
  Wallet,
  X,
  Tag,
  Plus,
  List
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    currentTab,
    setCurrentTab,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleLogout,
    pendingApprovalsCount,
    theme
  } = useApp();

  const isLight = theme === 'light';

  // Multi-dropdown state object: { [itemName]: boolean }
  const [openDropdowns, setOpenDropdowns] = useState({
    Agents: false,
    'Agent Accounts': false,
    Exports: false,
    Manufacturing: false,
    Imports: false,
    Workers: false
  });

  // Track hover popover for collapsed sidebar
  const [hoveredItem, setHoveredItem] = useState(null);

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, tab: 'Dashboard' }
      ]
    },
    {
      group: 'CRM & SALES',
      items: [
        {
          name: 'Billing',
          icon: Receipt,
          tab: 'Billing',
          openNewTab: true,
          badge: 'NEW'
        },
        { name: 'Sales', icon: Receipt, tab: 'Sales' },
        {
          name: 'Agents',
          icon: Users,
          subItems: [
            { name: 'Add Agents', tab: 'Addagents', icon: UserPlus },
            { name: 'List Agents', tab: 'Listagents', icon: ClipboardList }
          ]
        },
        {
          name: 'Agent Accounts',
          icon: Wallet,
          subItems: [
            { name: 'Agent Accounts', tab: 'AgentAccounts', icon: CreditCard },
            { name: 'Agent Reports', tab: 'AgentReports', icon: FileSpreadsheet }
          ]
        },
        { name: 'Customers', icon: Users, tab: 'Customers' },
        { name: 'Products', icon: Boxes, tab: 'Products' },
        {
          name: 'Exports',
          icon: ArrowUpRight,
          subItems: [
            { name: 'Admin Existing Stock', tab: 'ExportsStock', icon: List },
            { name: 'Daily Register', tab: 'ExportsRegister', icon: Plus }
          ]
        },
        { name: 'Dispatch', icon: Truck, tab: 'Dispatch' }
      ]
    },
    {
      group: 'MANUFACTURING',
      items: [
        {
          name: 'Manufacturing',
          icon: Factory,
          subItems: [
            { name: 'Production Orders', tab: 'Production' },
            { name: 'Bill of Materials (BOM)', tab: 'BOM' },
            { name: 'Raw Materials', tab: 'RawMaterials' },
            { name: 'Quality Control', tab: 'QualityControl' },
            { name: 'Packaging Hub', tab: 'Packing' }
          ]
        }
      ]
    },
    {
      group: 'INVENTORY & PURCHASES',
      items: [
        { name: 'Item Master', icon: Tag, tab: 'ItemMaster' },
        { name: 'Stock', icon: Boxes, tab: 'Stock' },
        { name: 'Inventory Reports', icon: FileSpreadsheet, tab: 'InventoryReports' },
        {
          name: 'Imports',
          icon: ArrowDownLeft,
          subItems: [
            { name: 'Add Imports', tab: 'ImportsAdd', icon: Plus },
            { name: 'List Imports', tab: 'ImportsList', icon: List }
          ]
        },
        { name: 'Purchases', icon: ShoppingBag, tab: 'Purchases' },
        { name: 'Suppliers', icon: Building2, tab: 'Suppliers' }
      ]
    },
    {
      group: 'WORKFORCE & HR',
      items: [
        {
          name: 'Workers',
          icon: Users,
          subItems: [
            { name: 'Add Workers', tab: 'Addworkers', icon: UserPlus },
            { name: 'List Workers', tab: 'Listworkers', icon: ClipboardList }
          ]
        },
        { name: 'Attendance', icon: CalendarCheck, tab: 'Attendance' },
        { name: 'Payroll', icon: CreditCard, tab: 'Payroll' }
      ]
    },
    {
      group: 'GOVERNANCE & SYSTEM',
      items: [
        { name: 'Other Expenses', icon: Receipt, tab: 'OtherExpenses' },
        { name: 'Safety', icon: ShieldAlert, tab: 'Safety' },
        { name: 'Approvals', icon: CheckSquare, tab: 'Approvals', badge: pendingApprovalsCount },
        { name: 'Documents', icon: FileText, tab: 'Documents' },
        { name: 'Audit Log', icon: Shield, tab: 'AuditLog' },
        { name: 'Analytics', icon: BarChart3, tab: 'Analytics' },
        { name: 'Reports', icon: FileSpreadsheet, tab: 'Reports' },
        { name: 'Settings', icon: Settings, tab: 'Settings' }
      ]
    }
  ];

  // Auto-expand dropdown if active tab belongs to its sub-items
  useEffect(() => {
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.subItems && item.subItems.some((sub) => (sub.tab || sub.name) === currentTab)) {
          setOpenDropdowns((prev) => ({ ...prev, [item.name]: true }));
        }
      });
    });
  }, [currentTab]);

  const toggleDropdown = (itemName) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleNavClick = (tabName, item = null) => {
    if (item && item.openNewTab) {
      const url = `${window.location.origin}${window.location.pathname}?tab=${tabName}`;
      window.open(url, '_blank');
      if (mobileMenuOpen) setMobileMenuOpen(false);
      setHoveredItem(null);
      return;
    }
    if (tabName) {
      setCurrentTab(tabName);
    }
    if (mobileMenuOpen) setMobileMenuOpen(false);
    setHoveredItem(null);
  };

  const isItemActive = (item) => {
    const itemTab = item.tab || item.name;
    if (currentTab === itemTab) return true;
    if (item.subItems && item.subItems.some((sub) => (sub.tab || sub.name) === currentTab)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        } ${mobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'} ${
          isLight
            ? 'bg-white border-r border-slate-200 text-slate-800 shadow-sm'
            : 'bg-slate-950 border-r border-slate-800/80 text-slate-100'
        }`}
      >
        {/* Top Logo */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className={`h-18 flex items-center justify-between px-4 border-b shrink-0 py-4 ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-950'
          }`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-0.5 shadow-md shadow-orange-500/20 shrink-0">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  isLight ? 'bg-orange-50' : 'bg-slate-950'
                }`}>
                  <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
              </div>
              {(!sidebarCollapsed || mobileMenuOpen) && (
                <div className="truncate">
                  <h1 className={`font-black text-lg tracking-wider flex items-center gap-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    Cracker<span className="text-orange-500">Hub</span>
                  </h1>
                  <p className={`text-[10px] font-semibold tracking-widest uppercase ${
                    isLight ? 'text-amber-600' : 'text-amber-400'
                  }`}>
                    CRM & Factory ERP
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Collapse & Mobile Close Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`hidden md:flex p-1.5 rounded-lg border transition-colors shrink-0 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`md:hidden p-1.5 rounded-lg border shrink-0 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Items List */}
          <div className="p-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <p className={`px-3 text-[10px] font-bold tracking-wider uppercase mb-1.5 ${
                    isLight ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {group.group}
                  </p>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const hasDropdown = Array.isArray(item.subItems) && item.subItems.length > 0;
                  const isOpen = !!openDropdowns[item.name];
                  const active = isItemActive(item);
                  const isDirectActive = currentTab === (item.tab || item.name);

                  return (
                    <div
                      key={item.name}
                      className="relative group/item"
                      onMouseEnter={() => sidebarCollapsed && !mobileMenuOpen && setHoveredItem(item.name)}
                      onMouseLeave={() => sidebarCollapsed && !mobileMenuOpen && setHoveredItem(null)}
                    >
                      {/* Main Navigation Item Button */}
                      <button
                        onClick={() => {
                          if (hasDropdown) {
                            toggleDropdown(item.name);
                          } else {
                            handleNavClick(item.tab || item.name, item);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group relative ${
                          active
                            ? isLight
                              ? 'bg-orange-50 text-orange-600 border border-orange-200 shadow-sm font-bold'
                              : 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-lg shadow-orange-500/10 font-bold'
                            : isLight
                              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                        }`}
                        title={sidebarCollapsed && !mobileMenuOpen ? item.name : undefined}
                        aria-expanded={hasDropdown ? isOpen : undefined}
                      >
                        {/* Left side - Icon + Label */}
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-all duration-200 group-hover:scale-110 ${
                              active
                                ? isLight ? 'text-orange-600' : 'text-orange-400 group-hover:text-white'
                                : isLight ? 'text-slate-500 group-hover:text-orange-600' : 'text-slate-400 group-hover:text-white'
                            }`}
                          />

                          {(!sidebarCollapsed || mobileMenuOpen) && (
                            <span className={`truncate ${
                              active
                                ? isLight ? 'text-orange-600 font-bold' : 'text-orange-400 font-bold'
                                : isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-300 group-hover:text-white'
                            }`}>
                              {item.name}
                            </span>
                          )}
                        </div>

                        {/* Right side - Badge & Chevron */}
                        {(!sidebarCollapsed || mobileMenuOpen) && (
                          <div className="flex items-center gap-2">
                            {/* Badge */}
                            {item.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-orange-500 text-white shadow-sm">
                                {item.badge}
                              </span>
                            )}

                            {/* Dropdown Chevron */}
                            {hasDropdown && (
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isOpen
                                    ? isLight ? 'rotate-180 text-orange-600' : 'rotate-180 text-orange-400 group-hover:text-white'
                                    : isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-slate-400 group-hover:text-white'
                                }`}
                              />
                            )}
                          </div>
                        )}

                        {/* Active Indicator Bar */}
                        {isDirectActive && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-orange-500 rounded-l-full shadow-md shadow-orange-500/50" />
                        )}
                      </button>

                      {/* Expanded Submenu Dropdown for Expanded Sidebar / Mobile */}
                      {hasDropdown && isOpen && (!sidebarCollapsed || mobileMenuOpen) && (
                        <div className={`ml-5 pl-3 mt-1 space-y-1 border-l animate-fade-in ${
                          isLight ? 'border-slate-200' : 'border-slate-800/80'
                        }`}>
                          {item.subItems.map((sub) => {
                            const subTab = sub.tab || sub.name;
                            const isSubActive = currentTab === subTab;
                            const SubIcon = sub.icon;

                            return (
                              <button
                                key={sub.name}
                                onClick={() => handleNavClick(subTab)}
                                className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 relative group/sub ${
                                  isSubActive
                                    ? isLight
                                      ? 'text-orange-600 bg-orange-50 font-bold border border-orange-200/80 shadow-xs'
                                      : 'text-orange-400 bg-orange-500/15 font-bold border border-orange-500/20 shadow-sm'
                                    : isLight
                                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {SubIcon ? (
                                    <SubIcon
                                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                        isSubActive
                                          ? isLight ? 'text-orange-600' : 'text-orange-400'
                                          : isLight ? 'text-slate-400 group-hover/sub:text-orange-600' : 'text-slate-400 group-hover/sub:text-white'
                                      }`}
                                    />
                                  ) : (
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        isSubActive
                                          ? isLight ? 'bg-orange-500 ring-2 ring-orange-200' : 'bg-orange-400 ring-2 ring-orange-500/30'
                                          : isLight ? 'bg-slate-300 group-hover/sub:bg-slate-500' : 'bg-slate-600 group-hover/sub:bg-white'
                                      }`}
                                    />
                                  )}
                                  <span className={`truncate ${
                                    isSubActive
                                      ? isLight ? 'text-orange-600 font-bold' : 'text-orange-400 font-bold'
                                      : isLight ? 'text-slate-600 group-hover/sub:text-slate-900' : 'text-slate-400 group-hover/sub:text-white'
                                  }`}>
                                    {sub.name}
                                  </span>
                                </div>

                                {sub.badge > 0 && (
                                  <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                                    isLight
                                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                      : 'bg-slate-800 text-orange-400 border border-slate-700'
                                  }`}>
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Collapsed Sidebar Hover Popover Submenu */}
                      {sidebarCollapsed && !mobileMenuOpen && hoveredItem === item.name && (
                        <div className={`fixed left-20 z-50 ml-2 w-52 rounded-2xl p-2.5 animate-fade-in backdrop-blur-xl ${
                          isLight
                            ? 'bg-white border border-slate-200 shadow-xl shadow-slate-300/40'
                            : 'bg-slate-900 border border-slate-800 shadow-2xl'
                        }`}>
                          <div className={`px-2.5 py-1.5 border-b mb-1 flex items-center justify-between ${
                            isLight ? 'border-slate-100 text-slate-800' : 'border-slate-800/80 text-white'
                          }`}>
                            <span className="text-xs font-bold flex items-center gap-1.5">
                              <Icon className={`w-3.5 h-3.5 ${isLight ? 'text-orange-500' : 'text-orange-400'}`} />
                              <span className={isLight ? 'text-slate-900' : 'text-white'}>{item.name}</span>
                            </span>
                            {item.badge > 0 && (
                              <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-orange-500 text-white shadow-xs">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          {hasDropdown ? (
                            <div className="space-y-1">
                              {item.subItems.map((sub) => {
                                const subTab = sub.tab || sub.name;
                                const isSubActive = currentTab === subTab;
                                const SubIcon = sub.icon;
                                return (
                                  <button
                                    key={sub.name}
                                    onClick={() => handleNavClick(subTab)}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors group/popsub ${
                                      isSubActive
                                        ? isLight
                                          ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                                          : 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30'
                                        : isLight
                                          ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                    }`}
                                  >
                                    {SubIcon ? (
                                      <SubIcon
                                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                          isSubActive
                                            ? isLight ? 'text-orange-600' : 'text-orange-400'
                                            : isLight ? 'text-slate-400 group-hover/popsub:text-orange-600' : 'text-slate-400 group-hover/popsub:text-white'
                                        }`}
                                      />
                                    ) : (
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                          isSubActive
                                            ? isLight ? 'bg-orange-500' : 'bg-orange-400'
                                            : isLight ? 'bg-slate-300 group-hover/popsub:bg-slate-500' : 'bg-slate-600 group-hover/popsub:bg-white'
                                        }`}
                                      />
                                    )}
                                    <span className="truncate">{sub.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleNavClick(item.tab || item.name)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                                isLight
                                  ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                              }`}
                            >
                              Open {item.name}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Bottom */}
        <div className={`p-3 border-t shrink-0 ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-950'
        }`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isLight
                ? 'text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100'
                : 'text-rose-400 hover:bg-rose-500/10 border border-transparent'
            }`}
            title={sidebarCollapsed && !mobileMenuOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
