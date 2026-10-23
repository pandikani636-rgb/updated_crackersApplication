import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  IndianRupee,
  Users,
  Boxes,
  Truck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CHART_IMPORT_EXPORT_DATA, CHART_TOP_SELLING } from '../../data/mockData';

export const AnalyticsView = () => {
  const { formatCurrency, suppliers, payroll, stock } = useApp();

  const [timeRange, setTimeRange] = useState('This Month');

  const supplierPieData = suppliers.map(s => ({
    name: s.name.split(' ')[0],
    value: s.totalAmount
  }));

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#f59e0b', '#8b5cf6'];

  const attendanceGraphData = [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 96 },
    { day: 'Thu', rate: 91 },
    { day: 'Fri', rate: 98 },
    { day: 'Sat', rate: 100 },
    { day: 'Sun', rate: 95 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" /> Business Analytics & SaaS Insights
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep financial metrics, supplier share, profit margins, and workforce attendance insights.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {['Today', 'This Week', 'This Month', 'Last Month', 'Custom'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === range ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 High Level Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Estimated Net Profit Margin</p>
          <h3 className="text-2xl font-black text-emerald-400 mt-2">₹3,45,250 (+34%)</h3>
          <p className="text-[11px] text-slate-500 mt-1">Calculated after import costs & payroll expenses</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Worker Attendance Rate</p>
          <h3 className="text-2xl font-black text-amber-400 mt-2">95.8% Average</h3>
          <p className="text-[11px] text-slate-500 mt-1">21 out of 24 workers consistent daily</p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Inventory Stock Turnover</p>
          <h3 className="text-2xl font-black text-blue-400 mt-2">4.2x / Month</h3>
          <p className="text-[11px] text-slate-500 mt-1">Fastest selling: Sparklers 15cm & Lakshmi Crack</p>
        </div>
      </div>

      {/* Grid of 4 Recharts Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Import vs Export Trend Line */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Monthly Import & Export Trend Comparison</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_IMPORT_EXPORT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="imports" name="Import Bundles" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="exports" name="Export Sales Bundles" stroke="#f97316" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Purchase Distribution Pie Chart */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-100 mb-2">Supplier-wise Purchase Share</h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={supplierPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45} paddingAngle={4}>
                  {supplierPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Purchases']} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-800 pt-3">
            {supplierPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Rate Graph */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Worker Daily Attendance Rate (%)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceGraphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(val) => [`${val}%`, 'Attendance Rate']} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="rate" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Salary Expense Bar Chart */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 mb-4">Monthly Salary Expense Breakdown</h3>
          <div className="space-y-3 pt-2">
            {payroll.slice(0, 5).map((p) => (
              <div key={p.empId} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{p.name} ({p.role || 'Staff'})</span>
                  <span className="text-emerald-400 font-mono font-bold">{formatCurrency(p.netSalary)}</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${Math.round((p.netSalary / 30000) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
