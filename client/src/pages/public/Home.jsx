import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Calendar, ShieldCheck, Star, Award, ChevronRight, Clock, Users, Flame } from 'lucide-react';
import API from '../../services/api';

export default function Home({ onOpenBooking }) {
  const [featuredBarbers, setFeaturedBarbers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [barberRes, serviceRes] = await Promise.all([
          API.get('/barbers'),
          API.get('/services'),
        ]);
        setFeaturedBarbers(barberRes.data.slice(0, 3));
        setServices(serviceRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center md:text-left grid md:grid-cols-2 items-center gap-12">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-gold-500" /> Premium Grooming Studio
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
              PRECISION CUTS. <br />
              <span className="gold-text-gradient">MASTER BARBERS.</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-lg leading-relaxed">
              Experience modern luxury barbering with online slot reservations, executive beard sculpting, and top-tier grooming services.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-xl gold-gradient text-black font-extrabold text-base shadow-xl shadow-gold-500/25 hover:opacity-95 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5 stroke-[2.5]" />
                Book Your Appointment
              </button>

              <Link
                to="/services"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-zinc-800/80 border border-zinc-700 text-zinc-200 font-bold text-base hover:bg-zinc-700 hover:text-white transition-all text-center flex items-center justify-center gap-2"
              >
                Explore Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-zinc-800/80">
              <div>
                <div className="text-2xl font-black text-white">4.9 ★</div>
                <div className="text-xs text-zinc-400">1,200+ Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-black text-gold-400">100%</div>
                <div className="text-xs text-zinc-400">Master Barbers</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">15k+</div>
                <div className="text-xs text-zinc-400">Happy Clients</div>
              </div>
            </div>

          </div>

          {/* Featured Hero Card */}
          <div className="hidden md:block">
            <div className="glass-card rounded-2xl p-6 space-y-4 border border-zinc-700/60 shadow-2xl relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gold-500 text-black text-xs font-black uppercase">
                VIP Experience
              </div>
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80"
                alt="Barber Studio"
                className="w-full h-64 object-cover rounded-xl border border-zinc-800"
              />
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold text-white">RoboCutz Executive VIP Combo</h3>
                  <p className="text-xs text-zinc-400">Cut + Royal Beard Shave + Charcoal Facial</p>
                </div>
                <span className="text-2xl font-black text-gold-400">$75</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-zinc-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Instant Slot Booking</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">No wait times in line. Lock in your exact slot with real-time barber availability calendars.</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-zinc-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Certified Master Barbers</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Handpicked professionals with 5+ years experience in precision scissor cutting and skin fades.</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-zinc-800 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Royal Hygiene Standards</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Medical-grade blade sterilization, hot towel steaming, and premium organic styling products.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Our Menu</span>
            <h2 className="text-3xl font-black text-white">SIGNATURE SERVICES</h2>
          </div>
          <Link to="/services" className="text-sm font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1">
            View All Services <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div key={s._id} className="bg-dark-800 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group">
              <div className="relative h-44 overflow-hidden">
                <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-dark-900/90 text-gold-400 font-extrabold text-sm border border-zinc-700">
                  ${s.price}
                </span>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{s.name}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{s.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                  <span className="text-zinc-500">⏱ {s.durationMinutes} mins</span>
                  <button
                    onClick={onOpenBooking}
                    className="text-gold-400 font-bold hover:underline"
                  >
                    Book This
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Barbers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Our Craftsmen</span>
          <h2 className="text-3xl font-black text-white">MEET THE MASTER BARBERS</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredBarbers.map((b) => (
            <div key={b._id} className="bg-dark-800 border border-zinc-800 rounded-2xl p-5 space-y-4 hover:border-gold-500/40 transition-all text-center">
              <img src={b.photo} alt={b.name} className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-gold-500/20" />
              <div>
                <h3 className="text-lg font-bold text-white">{b.name}</h3>
                <p className="text-xs text-gold-400 font-medium">{b.experience} • Rating {b.rating}★</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                {b.specialties?.map((spec, idx) => (
                  <span key={idx} className="text-[10px] px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800 font-medium">
                    {spec}
                  </span>
                ))}
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-lg bg-zinc-800 text-gold-400 hover:bg-gold-500 hover:text-black font-bold text-xs transition-colors"
              >
                Book with {b.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gold-gradient rounded-3xl p-8 sm:p-12 text-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black">READY FOR YOUR NEXT FRESH CUT?</h2>
            <p className="text-sm font-semibold opacity-90 max-w-lg">
              Select your favorite barber, pick your preferred service, and lock in your time slot online in seconds.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-8 py-4 rounded-2xl bg-black text-white font-extrabold text-sm hover:bg-zinc-900 shadow-xl"
          >
            Book Appointment Now
          </button>
        </div>
      </section>

    </div>
  );
}
