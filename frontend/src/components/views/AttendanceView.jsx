import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Calendar,
  Save,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AttendanceView = () => {
  const {
    attendance,
    updateWorkerAttendance,
    markAllPresent,
    showToast,
    workers
  } = useApp();

  const todayDateStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayDateStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'calendar'

  const filteredAttendance = attendance.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half Day').length;
  const leaveCount = attendance.filter((a) => a.status === 'Leave').length;

  const handleSaveAttendance = () => {
    showToast('Today attendance registry saved & locked.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-amber-400" /> Attendance Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track daily worker check-ins, check-outs, overtime working hours, and monthly calendars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'daily' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Daily Register
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar' ? 'bg-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Calendar
            </button>
          </div>

          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All Present
          </button>
          <button
            onClick={handleSaveAttendance}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Save className="w-4 h-4" /> Save Attendance
          </button>
        </div>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Workers</p>
          <h3 className="text-xl font-black text-white mt-1">{workers.length}</h3>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Present Today</p>
          <h3 className="text-xl font-black text-emerald-400 mt-1">{presentCount}</h3>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Absent</p>
          <h3 className="text-xl font-black text-rose-400 mt-1">{absentCount}</h3>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">Half Day</p>
          <h3 className="text-xl font-black text-amber-400 mt-1">{halfDayCount}</h3>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] text-slate-400 uppercase font-semibold">On Leave</p>
          <h3 className="text-xl font-black text-blue-400 mt-1">{leaveCount}</h3>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <>
          {/* Controls Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search worker by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">Date:</span>
              <input
                type="date"
                max={todayDateStr}
                value={selectedDate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val > todayDateStr) {
                    showToast('Future dates are not allowed', 'warning');
                    setSelectedDate(todayDateStr);
                  } else {
                    setSelectedDate(val);
                  }
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Attendance Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Worker Name</th>
                    <th className="p-4 text-center">Date</th>
                    <th className="p-4 text-center">Check In</th>
                    <th className="p-4 text-center">Check Out</th>
                    <th className="p-4 text-center">Working Hours</th>
                    <th className="p-4 text-center">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredAttendance.map((item) => (
                    <tr key={item.empId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-400">{item.empId}</td>
                      <td className="p-4 font-bold text-white">{item.name}</td>
                      <td className="p-4 text-center font-mono text-slate-400">{selectedDate}</td>
                      <td className="p-4 text-center font-mono text-slate-300">{item.checkIn}</td>
                      <td className="p-4 text-center font-mono text-slate-300">{item.checkOut}</td>
                      <td className="p-4 text-center font-mono font-bold text-emerald-400">
                        {item.hours > 0 ? `${item.hours} hrs` : '--'}
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={item.status}
                          onChange={(e) => updateWorkerAttendance(item.empId, e.target.value)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border focus:outline-none transition-colors ${
                            item.status === 'Present'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : item.status === 'Absent'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : item.status === 'Half Day'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}
                        >
                          <option value="Present" className="bg-slate-900 text-emerald-400">Present</option>
                          <option value="Absent" className="bg-slate-900 text-rose-400">Absent</option>
                          <option value="Half Day" className="bg-slate-900 text-amber-400">Half Day</option>
                          <option value="Leave" className="bg-slate-900 text-blue-400">Leave</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Monthly Calendar Grid View */
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" /> August 2026 Monthly Attendance Matrix
            </h3>
            <span className="text-xs text-amber-400 font-mono font-semibold">26 Working Days</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase pb-2 border-b border-slate-800">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isToday = day === 26;
              return (
                <div
                  key={day}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isToday
                      ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 font-black shadow-lg shadow-orange-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-mono font-bold block">{day}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">21 Pres</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
