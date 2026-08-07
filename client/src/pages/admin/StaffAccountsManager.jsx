import React, { useState } from 'react';
import { UserPlus, ShieldCheck, Mail, Lock, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../../services/api';

export default function StaffAccountsManager() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'receptionist',
    specialties: 'Skin Fade, Beard Sculpting',
    experience: '4+ years',
    bio: 'Professional master barber.',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await API.post('/auth/create-staff', formData);
      setStatusMsg({ type: 'success', text: res.data.message });
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'receptionist',
        specialties: 'Skin Fade, Beard Sculpting',
        experience: '4+ years',
        bio: '',
      });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Error creating staff account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">STAFF ACCOUNTS CREATION</h1>
        <p className="text-xs text-zinc-400">Admin utility to register new Barber or Receptionist credentials</p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {statusMsg.text}
        </div>
      )}

      <div className="bg-dark-800 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold">Staff Account Role *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'receptionist' })}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  formData.role === 'receptionist' ? 'gold-gradient text-black border-gold-400 shadow' : 'bg-dark-900 text-zinc-400 border-zinc-700'
                }`}
              >
                Receptionist / Cashier
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'barber' })}
                className={`py-2.5 rounded-xl font-bold border transition-all ${
                  formData.role === 'barber' ? 'gold-gradient text-black border-gold-400 shadow' : 'bg-dark-900 text-zinc-400 border-zinc-700'
                }`}
              >
                Master Barber
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Staff Member Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Email Address (Login ID) *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="staff@robocutz.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 mb-1">Initial Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
              />
            </div>
          </div>

          {formData.role === 'barber' && (
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <h4 className="font-bold text-gold-400">Barber Profile Options</h4>
              <div>
                <label className="block text-zinc-400 mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  placeholder="Skin Fade, Beard Trim"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="5+ years"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Registering Account...' : <><UserPlus className="w-4 h-4" /> Create Staff Account</>}
          </button>

        </form>
      </div>

    </div>
  );
}
