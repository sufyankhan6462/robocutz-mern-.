import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Scissors, User, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

export default function CustomerDashboard({ onOpenBooking }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(appointmentId);
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: 'cancelled' });
      setMsg('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-dark-800 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-black text-2xl font-black shadow-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Customer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Welcome back, {user?.name}!</h1>
            <p className="text-xs text-zinc-400">{user?.email} • {user?.phone || 'No phone recorded'}</p>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="px-6 py-3.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-xl flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" /> Book New Appointment
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          {msg}
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold-400" /> My Appointment History
          </h2>
          <button
            onClick={fetchAppointments}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-zinc-400 text-xs">
            <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Fetching your appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-dark-800 border border-zinc-800 rounded-2xl p-12 text-center space-y-4">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              You haven't scheduled any appointments yet. Click below to choose your favorite barber and time slot!
            </p>
            <button
              onClick={onOpenBooking}
              className="px-6 py-2.5 rounded-xl gold-gradient text-black font-bold text-xs shadow-lg inline-block"
            >
              Book Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((app) => (
              <div key={app._id} className="bg-dark-800 border border-zinc-800 rounded-2xl p-5 space-y-4 hover:border-zinc-700 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{app.service?.name || 'Haircut Service'}</h3>
                    <p className="text-xs text-gold-400 font-medium">Barber: {app.barber?.name || 'Master Barber'}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                <div className="bg-dark-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span>Date & Time:</span>
                    <span className="text-white font-semibold">{app.date} @ {app.timeSlot}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Price:</span>
                    <span className="text-gold-400 font-bold">${app.totalPrice}</span>
                  </div>
                  {app.notes && (
                    <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800 mt-1">
                      Note: {app.notes}
                    </div>
                  )}
                </div>

                {app.status === 'confirmed' || app.status === 'pending' ? (
                  <div className="pt-2 flex justify-end">
                    <button
                      disabled={cancellingId === app._id}
                      onClick={() => handleCancel(app._id)}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === app._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
