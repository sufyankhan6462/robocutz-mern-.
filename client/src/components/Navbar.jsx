import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Fix import
import { Link as RouterLink } from 'react-router-dom';
import { Scissors, Calendar, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenBooking }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-dark-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <RouterLink to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center text-black font-extrabold shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
            <Scissors className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider text-white">ROBO<span className="text-gold-500">CUTZ</span></span>
            <span className="block text-[10px] tracking-widest text-zinc-400 font-semibold uppercase -mt-1">Barber Shop & Studio</span>
          </div>
        </RouterLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <RouterLink to="/" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">Home</RouterLink>
          <RouterLink to="/services" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">Services</RouterLink>
          <RouterLink to="/barbers" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">Barbers</RouterLink>
          <RouterLink to="/gallery" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">Gallery</RouterLink>
          <RouterLink to="/about" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">About</RouterLink>
          <RouterLink to="/contact" className="text-sm font-medium text-zinc-300 hover:text-gold-400 transition-colors">Contact</RouterLink>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenBooking}
            className="px-5 py-2.5 rounded-lg gold-gradient text-black font-bold text-sm shadow-md shadow-gold-500/20 hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </button>

          {user ? (
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
              <RouterLink
                to={user.role === 'customer' ? '/dashboard' : '/admin'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white text-xs font-semibold transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-gold-400" />
                {user.role === 'customer' ? 'My Bookings' : 'Staff Dashboard'}
              </RouterLink>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <RouterLink
              to="/login"
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4 text-gold-400" />
              Login / Sign Up
            </RouterLink>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-dark-900 px-4 pt-2 pb-6 space-y-3">
          <RouterLink to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">Home</RouterLink>
          <RouterLink to="/services" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">Services</RouterLink>
          <RouterLink to="/barbers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">Barbers</RouterLink>
          <RouterLink to="/gallery" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">Gallery</RouterLink>
          <RouterLink to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">About</RouterLink>
          <RouterLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-gold-400 font-medium">Contact</RouterLink>
          
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 rounded-lg gold-gradient text-black font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
            {user ? (
              <div className="flex gap-2">
                <RouterLink
                  to={user.role === 'customer' ? '/dashboard' : '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-lg bg-zinc-800 text-gold-400 text-xs font-semibold"
                >
                  Dashboard
                </RouterLink>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <RouterLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-lg bg-zinc-800 text-center text-zinc-200 text-sm font-medium"
              >
                Login / Sign Up
              </RouterLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
