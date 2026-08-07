import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-zinc-800 text-zinc-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black font-extrabold shadow-md">
              <Scissors className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black text-white">ROBO<span className="text-gold-500">CUTZ</span></span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Where traditional barbering meets modern technology. Experience premium haircuts, precision beard sculpts, and seamless online booking.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#instagram" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:bg-zinc-700 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#facebook" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:bg-zinc-700 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:bg-zinc-700 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wider uppercase">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-gold-400 transition-colors">Our Services & Prices</Link></li>
            <li><Link to="/barbers" className="hover:text-gold-400 transition-colors">Meet Our Master Barbers</Link></li>
            <li><Link to="/gallery" className="hover:text-gold-400 transition-colors">Hairstyle Work Samples</Link></li>
            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Our Shop</Link></li>
            <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact & Location</Link></li>
          </ul>
        </div>

        {/* Col 3: Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wider uppercase">Working Hours</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
              <span>Mon - Fri</span>
              <span className="text-gold-400 font-medium">9:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
              <span>Saturday</span>
              <span className="text-gold-400 font-medium">9:00 AM - 7:00 PM</span>
            </div>
            <div className="flex justify-between items-center pb-1.5">
              <span>Sunday</span>
              <span className="text-zinc-500 font-medium">10:00 AM - 4:00 PM</span>
            </div>
          </div>
        </div>

        {/* Col 4: Shop Address & Contact */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wider uppercase">Find Us</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <span>742 Evergreen Terrace, Downtown Studio Suite 10, Metro City</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gold-400 shrink-0" />
              <span>+1 (555) 019-ROBO (7626)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gold-400 shrink-0" />
              <span>booking@robocutz.com</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© {new Date().getFullYear()} RoboCutz Studio. All Rights Reserved.</p>
        <p className="flex items-center gap-1">Built with MERN Stack • 6-Week Internship Training Project</p>
      </div>
    </footer>
  );
}
