import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, LayoutDashboard, Calendar, ShoppingBag, Users, Layers, Package, BarChart3, LogOut, UserPlus, ShieldAlert, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function StaffLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, roles: ['admin', 'receptionist', 'barber'] },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar, roles: ['admin', 'receptionist', 'barber'] },
    { label: 'Walk-in POS', path: '/admin/pos', icon: ShoppingBag, roles: ['admin', 'receptionist'] },
    { label: 'Barbers', path: '/admin/barbers', icon: Users, roles: ['admin'] },
    { label: 'Services', path: '/admin/services', icon: Layers, roles: ['admin'] },
    { label: 'Products & Stock', path: '/admin/products', icon: Package, roles: ['admin', 'receptionist'] },
    { label: 'Staff Accounts', path: '/admin/staff', icon: UserPlus, roles: ['admin'] },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3, roles: ['admin'] },
  ];

  const allowedItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col md:flex-row text-zinc-100">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-dark-800 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        
        <div className="p-5 space-y-6">
          
          {/* Logo Header */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-black font-extrabold shadow-md">
              <Scissors className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black text-white">ROBO<span className="text-gold-500">CUTZ</span></span>
              <span className="block text-[9px] tracking-widest text-zinc-400 font-semibold uppercase">Staff Portal</span>
            </div>
          </Link>

          {/* User Badge */}
          <div className="p-3 rounded-xl bg-dark-900 border border-zinc-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 font-bold flex items-center justify-center text-xs">
              {user?.role ? user.role[0].toUpperCase() : 'S'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
              <span className="text-[10px] text-gold-400 capitalize font-medium">{user?.role} Mode</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'gold-gradient text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-800 space-y-2">
          <Link to="/" className="w-full py-2 px-3 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-between border border-zinc-800">
            <span>Public Website</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
}
