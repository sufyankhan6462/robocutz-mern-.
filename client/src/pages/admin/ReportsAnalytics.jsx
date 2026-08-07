import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import API from '../../services/api';

export default function ReportsAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await API.get('/reports/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400 text-xs">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Generating visual reports & analytics...
      </div>
    );
  }

  const pieData = [
    { name: 'Confirmed', value: analytics?.statusCounts?.confirmed || 0, color: '#10B981' },
    { name: 'Completed', value: analytics?.statusCounts?.completed || 0, color: '#3B82F6' },
    { name: 'Pending', value: analytics?.statusCounts?.pending || 0, color: '#F59E0B' },
    { name: 'Cancelled', value: analytics?.statusCounts?.cancelled || 0, color: '#EF4444' },
    { name: 'No-Show', value: analytics?.statusCounts?.noShow || 0, color: '#6B7280' },
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">REPORTS & FINANCIAL ANALYTICS</h1>
        <p className="text-xs text-zinc-400">7-day revenue trend, appointment booking distribution, and sales metrics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Revenue Trend Chart */}
        <div className="bg-dark-800 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-400" /> 7-Day Total Revenue ($)
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="dayName" stroke="#A1A1AA" tick={{ fontSize: 11 }} />
                <YAxis stroke="#A1A1AA" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', color: '#FFF' }}
                />
                <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-dark-800 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gold-400" /> Appointment Status Distribution
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181B', borderColor: '#3F3F46', borderRadius: '8px', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold pt-2 border-t border-zinc-800">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-zinc-300">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
