import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';
import API from '../../services/api';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Haircut',
    price: 30,
    durationMinutes: 30,
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await API.get('/services');
      setServices(res.data);
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
      category: 'Haircut',
      price: 35,
      durationMinutes: 30,
      description: 'Precision scissor and clipper cut with razor clean-up.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (service) => {
    setEditingId(service._id);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      durationMinutes: service.durationMinutes,
      description: service.description,
      image: service.image,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/services/${editingId}`, formData);
      } else {
        await API.post('/services', formData);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">SERVICES MANAGEMENT</h1>
          <p className="text-xs text-zinc-400">Manage shop haircut packages, prices, and service durations</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add New Service
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-xs">
          <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading services...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-dark-800 border border-zinc-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-bold text-white">{s.name}</h3>
                  <span className="text-sm font-black text-gold-400">${s.price}</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{s.description}</p>
                <div className="mt-3 flex gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">{s.category}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-gold-400 border border-zinc-800 font-bold">⏱ {s.durationMinutes} mins</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-800"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-800 border border-zinc-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  >
                    {['Haircut', 'Beard', 'Coloring', 'Facial & Care', 'Combo'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
