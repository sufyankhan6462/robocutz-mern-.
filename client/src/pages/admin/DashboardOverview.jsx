import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, ShoppingBag, Users, Clock, TrendingUp, Scissors, ChevronRight } from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [statsRes, appRes] = await Promise.all([
          API.get('/reports/dashboard-stats'),
          API.get(`/appointments?date=${todayStr}`),
        ]);
        setStats(statsRes.data);
        setTodayAppointments(appRes.data);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400 text-xs">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading dashboard overview...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">STAFF DASHBOARD OVERVIEW</h1>
        <p className="text-xs text-zinc-400">Live operational snapshot & daily appointment tracking</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats?.todayAppointments || 0}</div>
          <p className="text-[11px] text-zinc-500">Scheduled for today</p>
        </div>

        <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold">Today's Walk-in Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats?.todayWalkinSalesCount || 0}</div>
          <p className="text-[11px] text-emerald-400 font-semibold">${stats?.todaySalesTotal || 0} walk-in revenue</p>
        </div>

        <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold">Total All-Time Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gold-400">${stats?.totalRevenue || 0}</div>
          <p className="text-[11px] text-zinc-500">Appointments + POS Sales</p>
        </div>

        <div className="bg-dark-800 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400">
            <span className="text-xs font-semibold">Active Staff & Services</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{stats?.totalBarbers || 0} Barbers</div>
          <p className="text-[11px] text-zinc-500">{stats?.totalServices || 0} Services offered</p>
        </div>

      </div>

      {/* Quick POS Action Callout */}
      <div className="gold-gradient rounded-2xl p-6 text-black flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-black uppercase">Walk-in Customer Waiting at Reception?</h3>
          <p className="text-xs font-semibold opacity-90">Use the Mini POS screen to add haircut services + retail grooming products instantly.</p>
        </div>
        <Link
          to="/admin/pos"
          className="px-6 py-3 rounded-xl bg-black text-white font-extrabold text-xs hover:bg-zinc-900 shadow"
        >
          Open Walk-in POS →
        </Link>
      </div>

      {/* Today's Schedule Table */}
      <div className="bg-dark-800 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-400" /> Today's Scheduled Appointments
          </h2>
          <Link to="/admin/appointments" className="text-xs text-gold-400 font-bold hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No appointments scheduled for today yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-900 text-zinc-400 font-bold uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Barber</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {todayAppointments.map((app) => (
                  <tr key={app._id} className="hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-bold text-gold-400">{app.timeSlot}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{app.customerName}</div>
                      <div className="text-[11px] text-zinc-500">{app.customerPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-300">{app.barber?.name}</td>
                    <td className="py-3 px-4 font-medium text-zinc-300">{app.service?.name} (${app.totalPrice})</td>
                    <td className="py-3 px-4"><StatusBadge status={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
