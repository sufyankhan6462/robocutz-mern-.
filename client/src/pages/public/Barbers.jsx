import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Calendar, Scissors, Award } from 'lucide-react';
import API from '../../services/api';

export default function Barbers({ onOpenBooking }) {
  const [barbers, setBarbers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);

  const specialtiesList = ['All', 'Skin Fade', 'Beard Sculpting', 'Classic Cut', 'Hot Towel Shave', 'Hair Coloring'];

  useEffect(() => {
    fetchBarbers();
  }, [selectedSpecialty]);

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      let url = '/barbers';
      const params = [];
      if (selectedSpecialty !== 'All') params.push(`specialty=${encodeURIComponent(selectedSpecialty)}`);
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await API.get(url);
      setBarbers(res.data);
    } catch (err) {
      console.error('Error fetching barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBarbers();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">OUR MASTER BARBERS</h1>
        <p className="text-sm text-zinc-400">
          Meet our team of licensed master barbers dedicated to precision cuts and royal beard care.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-dark-800 border border-zinc-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Specialty Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {specialtiesList.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSpecialty === spec
                  ? 'gold-gradient text-black font-bold shadow'
                  : 'bg-dark-900 text-zinc-300 border border-zinc-700 hover:text-white'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search barber by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Barbers Grid */}
      {loading ? (
        <div className="py-20 text-center text-zinc-400 text-sm">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading master barbers...
        </div>
      ) : barbers.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 bg-dark-800 rounded-2xl border border-zinc-800">
          No barbers found matching your search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map((b) => (
            <div key={b._id} className="bg-dark-800 border border-zinc-800 rounded-2xl overflow-hidden hover:border-gold-500/50 transition-all flex flex-col justify-between group">
              <div className="relative h-64 overflow-hidden">
                <img src={b.photo} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-dark-900/90 text-gold-400 font-extrabold text-xs border border-zinc-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-gold-400" /> {b.rating}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{b.name}</h3>
                  <p className="text-xs text-gold-400 font-medium mb-3 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> {b.experience} Experience
                  </p>
                  <p className="text-xs text-zinc-400 line-clamp-2">{b.bio}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-zinc-800">
                  <div className="flex flex-wrap gap-1.5">
                    {b.specialties?.map((spec, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/barber/${b._id}`}
                      className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 hover:bg-zinc-700 text-xs font-semibold text-center border border-zinc-800"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={onOpenBooking}
                      className="flex-1 py-2.5 rounded-xl gold-gradient text-black font-extrabold text-xs flex items-center justify-center gap-1 shadow-md"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Book Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
