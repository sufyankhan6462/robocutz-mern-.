import React, { useState, useEffect } from 'react';
import { Scissors, Clock, DollarSign, Calendar } from 'lucide-react';
import API from '../../services/api';

export default function Services({ onOpenBooking }) {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Haircut', 'Beard', 'Coloring', 'Facial & Care', 'Combo'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        let url = '/services';
        if (selectedCategory !== 'All') url += `?category=${encodeURIComponent(selectedCategory)}`;
        const res = await API.get(url);
        setServices(res.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">SERVICES & PRICING</h1>
        <p className="text-sm text-zinc-400">
          Choose from our premier range of haircutting, beard sculpting, coloring, and facial treatments.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'gold-gradient text-black font-bold shadow-md'
                : 'bg-dark-800 text-zinc-300 border border-zinc-700 hover:border-zinc-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400 text-sm">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading services...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-dark-800 border border-zinc-800 rounded-2xl overflow-hidden hover:border-gold-500/40 transition-all flex flex-col justify-between group">
              <div className="relative h-48">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-dark-900/90 text-gold-400 font-black text-base border border-zinc-700 shadow">
                  ${s.price}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur text-white text-[11px] font-semibold border border-zinc-800">
                  {s.category}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{s.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-gold-400" /> {s.durationMinutes} mins duration
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 rounded-lg gold-gradient text-black font-bold text-xs shadow hover:opacity-90 flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
