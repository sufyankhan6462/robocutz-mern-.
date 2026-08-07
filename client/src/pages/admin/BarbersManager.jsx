import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Star, Award, Check } from 'lucide-react';
import API from '../../services/api';

export default function BarbersManager() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    experience: '5+ years',
    rating: 4.9,
    specialties: 'Skin Fade, Beard Sculpting',
    bio: '',
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/barbers');
      setBarbers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      experience: '5+ years',
      rating: 4.9,
      specialties: 'Skin Fade, Beard Sculpting',
      bio: 'Professional master barber.',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (barber) => {
    setEditingId(barber._id);
    setFormData({
      name: barber.name,
      photo: barber.photo,
      experience: barber.experience,
      rating: barber.rating,
      specialties: barber.specialties ? barber.specialties.join(', ') : '',
      bio: barber.bio || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this barber profile?')) return;
    try {
      await API.delete(`/barbers/${id}`);
      fetchBarbers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete barber');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        specialties: formData.specialties.split(',').map((s) => s.trim()),
      };

      if (editingId) {
        await API.put(`/barbers/${editingId}`, payload);
      } else {
        await API.post('/barbers', payload);
      }

      setShowModal(false);
      fetchBarbers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving barber profile');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">BARBERS MANAGEMENT</h1>
          <p className="text-xs text-zinc-400">Add, edit, or remove master barber profiles and working schedules</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Barber
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading barbers...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div key={b._id} className="bg-dark-800 border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <img src={b.photo} alt={b.name} className="w-16 h-16 rounded-xl object-cover ring-2 ring-gold-500/20" />
                <div>
                  <h3 className="text-base font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-gold-400 font-medium">{b.experience} • Rating {b.rating}★</p>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{b.specialties?.join(', ')}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-800"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Barber Profile' : 'Add New Barber'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Barber Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Photo Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bio Description</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg gold-gradient text-black font-extrabold shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
