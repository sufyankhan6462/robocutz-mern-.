import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Award, Calendar, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import API from '../../services/api';

export default function BarberDetails({ onOpenBooking }) {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const res = await API.get(`/barbers/${id}`);
        setBarber(res.data);
      } catch (err) {
        console.error('Error fetching barber details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarber();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400 text-sm">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        Loading barber details...
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <p className="text-lg text-zinc-300">Barber profile not found.</p>
        <Link to="/barbers" className="inline-block px-5 py-2 rounded-lg bg-zinc-800 text-gold-400 text-xs font-bold">
          ← Back to All Barbers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link to="/barbers" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-gold-400">
        <ArrowLeft className="w-4 h-4" /> Back to Barbers
      </Link>

      <div className="bg-dark-800 border border-zinc-800 rounded-3xl p-6 sm:p-10 grid md:grid-cols-3 gap-8">
        
        {/* Barber Image */}
        <div className="space-y-4">
          <img src={barber.photo} alt={barber.name} className="w-full h-80 object-cover rounded-2xl border border-zinc-700 shadow-xl" />
          <button
            onClick={onOpenBooking}
            className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" /> Book Appointment with {barber.name.split(' ')[0]}
          </button>
        </div>

        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-xs font-extrabold uppercase border border-gold-500/20">
                Master Barber
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-400 text-gold-400" /> {barber.rating} Rating
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">{barber.name}</h1>
            <p className="text-sm font-semibold text-gold-400 flex items-center gap-1">
              <Award className="w-4 h-4" /> {barber.experience} Professional Experience
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Biography</h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{barber.bio || 'Dedicated to providing high precision cuts, modern hair styling, and supreme beard shaping.'}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {barber.specialties?.map((spec, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-dark-900 border border-zinc-700 text-xs font-medium text-zinc-200">
                  ⚡ {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Working Schedule</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                const isWorking = barber.workingDays?.includes(day);
                return (
                  <div
                    key={day}
                    className={`p-2 rounded-lg border text-center font-medium ${
                      isWorking ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 line-through'
                    }`}
                  >
                    {day}: {isWorking ? '9 AM - 6 PM' : 'Off'}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
