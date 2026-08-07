import React from 'react';
import { Scissors, ShieldCheck, Heart, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Our Heritage</span>
        <h1 className="text-4xl font-black text-white">THE STORY BEHIND ROBOCUTZ</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Founded with a mission to revolutionize traditional barbering, RoboCutz seamlessly blends master craftsmanship with modern web convenience.
        </p>
      </div>

      {/* Grid Story */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1000&auto=format&fit=crop&q=80"
          alt="Barber Shop Atmosphere"
          className="rounded-3xl border border-zinc-800 shadow-2xl w-full h-96 object-cover"
        />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">More Than Just A Cut — A Modern Grooming Experience</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            At RoboCutz, we believe that a haircut is more than just maintenance — it's an expression of confidence. Every chair in our studio is staffed by experienced master barbers trained in classic razor technique as well as contemporary hair trends.
          </p>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Our state-of-the-art booking system eliminates long waiting room lines, guaranteeing your barber is ready the moment you walk through our doors.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div>
              <h4 className="text-xl font-black text-gold-400">100%</h4>
              <p className="text-xs text-zinc-400">Sanitized & Sterilized Tools</p>
            </div>
            <div>
              <h4 className="text-xl font-black text-white">5 Star</h4>
              <p className="text-xs text-zinc-400">Customer Satisfaction Guarantee</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
