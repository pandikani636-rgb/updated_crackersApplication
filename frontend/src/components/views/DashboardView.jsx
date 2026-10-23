import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  IndianRupee,
  Boxes,
  Users,
  UserCheck,
  AlertTriangle,
  Flame,
  Plus,
  RefreshCw,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { KPICard } from '../common/KPICard';
import { CHART_IMPORT_EXPORT_DATA, CHART_TOP_SELLING } from '../../data/mockData';

export const DashboardView = () => {
  const {
    formatCurrency,
    todayImportsCount,
    todayExportsCount,
    totalImportAmount,
    totalExportRevenue,
    stock,
    workers,
    presentWorkersCount,
    lowStockCount,
    activities,
    setCurrentTab,
    theme
  } = useApp();

  const totalStockPackets = stock.reduce((acc, curr) => acc + curr.availablePackets, 0);

  const kpis = [
    {
      title: "Today's Imports",
      value: `${todayImportsCount} Bundles`,
      description: "Received from Sivakasi & Standard",
      icon: ArrowDownLeft,
      change: "+12%",
      isPositive: true,
      accent: "blue"
    },
    {
      title: "Today's Exports",
      value: `${todayExportsCount} Bundles`,
      description: "Dispatched to retailers & events",
      icon: ArrowUpRight,
      change: "+18%",
      isPositive: true,
      accent: "emerald"
    },
    {
      title: "Import Amount",
      value: formatCurrency(148500),
      description: "Spending on purchases today",
      icon: IndianRupee,
      change: "-5%",
      isPositive: true,
      accent: "amber"
    },
    {
      title: "Export Revenue",
      value: formatCurrency(216750),
      description: "Sales revenue earned today",
      icon: TrendingUp,
      change: "+24%",
      isPositive: true,
      accent: "orange"
    },
    {
      title: "Total Stock",
      value: `${totalStockPackets.toLocaleString('en-IN')} Packets`,
      description: "Across all 10 cracker categories",
      icon: Boxes,
      change: "Stable",
      isPositive: true,
      accent: "purple"
    },
    {
      title: "Total Workers",
      value: `${workers.length} Employees`,
      description: "Staff & store operators",
      icon: Users,
      change: "Active",
      isPositive: true,
      accent: "blue"
    },
    {
      title: "Present Today",
      value: `${presentWorkersCount} / ${workers.length}`,
      description: "95.8% attendance rate today",
      icon: UserCheck,
      change: "+4%",
      isPositive: true,
      accent: "emerald"
    },
    {
      title: "Low Stock Items",
      value: `${lowStockCount} Crackers`,
      description: "Requires immediate reorder",
      icon: AlertTriangle,
      change: "Action Required",
      isPositive: false,
      accent: "rose"
    }
  ];

  const lowStockItems = stock.filter(s => s.status === 'Low Stock' || s.availableBundles <= s.reorderLevel);

  const axisStroke = theme === 'light' ? '#475569' : '#94a3b8';
  const gridStroke = theme === 'light' ? '#e2e8f0' : '#334155';
  const tooltipStyle = theme === 'light'
    ? { backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
    : { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#ffffff', fontSize: '12px' };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4" /> Real-time Shop Overview
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">CrackerHub Shop Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">
            Live stock movements, import expenditure, export sales revenue, and workforce status for today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('Imports')}
            className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-xs rounded-xl border border-blue-500/30 flex items-center gap-2 transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" /> Add Import
          </button>
          <button
            onClick={() => setCurrentTab('Exports')}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Export Sale
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Import vs Export Bar/Line Chart */}
        <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Daily Import vs Export Quantities</h3>
              <p className="text-xs text-slate-400 mt-0.5">Bundle count trend for the past 7 days</p>
            </div>
            <span className="text-xs text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20 font-medium">
              This Week
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_IMPORT_EXPORT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
                <XAxis dataKey="day" stroke={axisStroke} fontSize={12} tickLine={false} />
                <YAxis stroke={axisStroke} fontSize={12} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="imports" name="Imports (Bundles)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="exports" name="Exports (Bundles)" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue vs Spending Area Chart */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-100">Revenue & Profit Growth</h3>
              <p className="text-xs text-slate-400 mt-0.5">Import spending vs Export revenue</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
              +32% Margin
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_IMPORT_EXPORT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
                <XAxis dataKey="day" stroke={axisStroke} fontSize={12} tickLine={false} />
                <YAxis stroke={axisStroke} fontSize={12} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                  contentStyle={tooltipStyle}
                />
                <Area type="monotone" dataKey="revenueExport" name="Export Revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="amountImport" name="Import Cost" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lower Row: Top Selling & Recent Activities & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Crackers Horizontal Bar Chart */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">Top Selling Crackers</h3>
            <button onClick={() => setCurrentTab('Analytics')} className="text-xs text-orange-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3.5">
            {CHART_TOP_SELLING.map((item, idx) => {
              const percentage = Math.round((item.sales / 550) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-amber-400 font-mono">{item.sales} Bundles ({formatCurrency(item.value)})</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Warning Alert Cards */}
        <div className="lg:col-span-3 glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" /> Low Stock Alerts
              </h3>
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                {lowStockItems.length} Warnings
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {lowStockItems.map((item, index) => (
                <div key={item._id || item.id || `${item.cracker}-${index}`} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{item.cracker}</h4>
                    <p className="text-[11px] text-slate-400">
                      Avail: <span className="text-rose-400 font-bold">{item.availableBundles} Bundles</span> ({item.availablePackets} Packets)
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('Imports')}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] rounded-lg shadow-md shadow-rose-600/30 transition-all"
                  >
                    Reorder
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('Stock')}
            className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl flex items-center justify-center gap-1 transition-colors"
          >
            Manage Stock Inventory <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Activities Timeline */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Recent Activities
            </h3>
            <span className="text-xs text-slate-400">Today</span>
          </div>

          <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
            {activities.map((act, index) => (
              <div key={act._id || act.id || `${act.timestamp || act.time}-${act.title || act.action}-${index}`} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-start gap-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${act.badge}`}>
                  {act.type.toUpperCase()}
                </span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-200">{act.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{act.description}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
