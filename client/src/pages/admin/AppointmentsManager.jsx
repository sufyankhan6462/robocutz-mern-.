import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Filter, Plus, RefreshCw, CheckCircle, XCircle, CheckCheck, AlertTriangle } from 'lucide-react';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterBarber, setFilterBarber] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Walk-in Quick Modal
  const [showWalkinModal, setShowWalkinModal] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinBarber, setWalkinBarber] = useState('');
  const [walkinService, setWalkinService] = useState('');
  const [walkinSlot, setWalkinSlot] = useState('10:00 AM');
  const [submittingWalkin, setSubmittingWalkin] = useState(false);

  useEffect(() => {
    fetchBarbersAndServices();
    fetchAppointments();
  }, [filterDate, filterBarber, filterStatus]);

  const fetchBarbersAndServices = async () => {
    try {
      const [bRes, sRes] = await Promise.all([API.get('/barbers'), API.get('/services')]);
      setBarbers(bRes.data);
      setServices(sRes.data);
      if (bRes.data.length > 0) setWalkinBarber(bRes.data[0]._id);
      if (sRes.data.length > 0) setWalkinService(sRes.data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = '/appointments?';
      if (filterDate) url += `date=${filterDate}&`;
      if (filterBarber) url += `barberId=${filterBarber}&`;
      if (filterStatus && filterStatus !== 'All') url += `status=${filterStatus}&`;

      const res = await API.get(url);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleWalkinSubmit = async (e) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone || !walkinBarber || !walkinService) {
      alert('Please fill in all walk-in appointment fields.');
      return;
    }
    setSubmittingWalkin(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await API.post('/appointments', {
        customerName: walkinName,
        customerPhone: walkinPhone,
        barberId: walkinBarber,
        serviceId: walkinService,
        date: todayStr,
        timeSlot: walkinSlot,
        isWalkIn: true,
      });
      setShowWalkinModal(false);
      setWalkinName('');
      setWalkinPhone('');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add walk-in appointment');
    } finally {
      setSubmittingWalkin(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">APPOINTMENTS MANAGEMENT</h1>
          <p className="text-xs text-zinc-400">Filter, confirm, complete or reschedule customer bookings</p>
        </div>

        <button
          onClick={() => setShowWalkinModal(true)}
          className="px-5 py-2.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Walk-in Appointment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-dark-800 border border-zinc-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-zinc-400 mb-1 font-semibold">Filter Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1 font-semibold">Filter Barber</label>
          <select
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white focus:border-gold-500 focus:outline-none"
          >
            <option value="">All Barbers</option>
            {barbers.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1 font-semibold">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white focus:border-gold-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => { setFilterDate(''); setFilterBarber(''); setFilterStatus('All'); }}
            className="w-full py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-semibold flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading appointments list...
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-dark-800 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 text-xs">
          No appointments found for the selected filter criteria.
        </div>
      ) : (
        <div className="bg-dark-800 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-900 text-zinc-400 font-bold uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Barber</th>
                  <th className="py-3.5 px-4">Service & Price</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Update Status Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-zinc-800/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.date}</div>
                      <div className="text-gold-400 font-semibold">{app.timeSlot}</div>
                      {app.isWalkIn && <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Walk-in</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{app.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{app.customerPhone}</div>
                      {app.customerEmail && <div className="text-[10px] text-zinc-500">{app.customerEmail}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-300">
                      {app.barber?.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{app.service?.name}</div>
                      <div className="text-gold-400 font-bold">${app.totalPrice}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {app.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'completed')}
                            title="Mark as Completed"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-bold"
                          >
                            ✓ Complete
                          </button>
                        )}
                        {app.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'cancelled')}
                            title="Cancel Appointment"
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[11px] font-bold"
                          >
                            ✕ Cancel
                          </button>
                        )}
                        {app.status !== 'no-show' && (
                          <button
                            onClick={() => handleStatusChange(app._id, 'no-show')}
                            title="Mark as No-Show"
                            className="p-1.5 rounded-lg bg-zinc-700/40 text-zinc-400 hover:bg-zinc-700 text-[11px] font-bold"
                          >
                            No-Show
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Add Walk-in Modal */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-zinc-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Add Quick Walk-in Appointment</h3>
            <form onSubmit={handleWalkinSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  placeholder="Walk-in Client Name"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Select Barber *</label>
                <select
                  value={walkinBarber}
                  onChange={(e) => setWalkinBarber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                >
                  {barbers.map((b) => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Select Service *</label>
                <select
                  value={walkinService}
                  onChange={(e) => setWalkinService(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                >
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} (${s.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Time Slot *</label>
                <input
                  type="text"
                  value={walkinSlot}
                  onChange={(e) => setWalkinSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWalkin}
                  className="flex-1 py-2.5 rounded-lg gold-gradient text-black font-extrabold shadow"
                >
                  {submittingWalkin ? 'Saving...' : 'Add Walk-in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
