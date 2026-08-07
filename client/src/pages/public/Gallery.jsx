import React, { useState } from 'react';
import { Camera, Calendar, Sparkles } from 'lucide-react';

export default function Gallery({ onOpenBooking }) {
  const [filter, setFilter] = useState('All');

  const galleryItems = [
    { id: 1, title: 'Low Skin Fade & Textured Top', category: 'Fade', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80', barber: 'Marcus Vance' },
    { id: 2, title: 'Royal Beard Sculpt & Sharp Edges', category: 'Beard', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=80', barber: 'Marcus Vance' },
    { id: 3, title: 'Classic Scissor Executive Cut', category: 'Classic', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80', barber: 'David Miller' },
    { id: 4, title: 'Mid Taper Fade & Razor Line', category: 'Fade', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80', barber: 'David Miller' },
    { id: 5, title: 'Sleek Blowout & Modern Pompadour', category: 'Styling', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80', barber: 'Elena Rostova' },
    { id: 6, title: 'Grey Blending & Platinum Highlight', category: 'Coloring', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80', barber: 'Elena Rostova' },
  ];

  const filtered = filter === 'All' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">WORK GALLERY</h1>
        <p className="text-sm text-zinc-400">
          Browse recent haircuts, beard sculpts, and transformations performed by our master barbers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {['All', 'Fade', 'Beard', 'Classic', 'Styling', 'Coloring'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filter === cat
                ? 'gold-gradient text-black font-bold shadow-md'
                : 'bg-dark-800 text-zinc-300 border border-zinc-700 hover:border-zinc-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-dark-800 border border-zinc-800 shadow-xl">
            <img src={item.image} alt={item.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider mb-1">{item.category} • By {item.barber}</span>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <button
                onClick={onOpenBooking}
                className="w-full py-2.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Book This Style
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
