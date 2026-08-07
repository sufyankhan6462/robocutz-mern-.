import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Lock, Mail, AlertCircle, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'customer') {
        navigate('/dashboard');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing demo accounts
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gold-gradient mx-auto flex items-center justify-center text-black font-extrabold shadow-xl">
            <Scissors className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white">ACCOUNT LOGIN</h1>
          <p className="text-xs text-zinc-400">Sign in to manage your bookings or access staff dashboard</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="bg-dark-800 border border-zinc-800 p-6 rounded-2xl space-y-5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@robocutz.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : <><LogIn className="w-4 h-4" /> Log In</>}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-zinc-800 space-y-2">
            <p className="text-[11px] font-bold text-gold-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3" /> Quick Demo Test Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@robocutz.com', 'admin123')}
                className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 text-left"
              >
                <div className="font-bold text-white">Admin</div>
                <div className="text-zinc-500">admin@robocutz.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('receptionist@robocutz.com', 'receptionist123')}
                className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 text-left"
              >
                <div className="font-bold text-white">Receptionist / POS</div>
                <div className="text-zinc-500">receptionist@robocutz.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('barber@robocutz.com', 'barber123')}
                className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 text-left"
              >
                <div className="font-bold text-white">Barber</div>
                <div className="text-zinc-500">barber@robocutz.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('customer@robocutz.com', 'customer123')}
                className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-gold-500/50 text-left"
              >
                <div className="font-bold text-white">Customer</div>
                <div className="text-zinc-500">customer@robocutz.com</div>
              </button>
            </div>
          </div>

        </div>

        <p className="text-center text-xs text-zinc-400">
          Don't have a customer account?{' '}
          <Link to="/register" className="text-gold-400 font-bold hover:underline">
            Register Now
          </Link>
        </p>

      </div>
    </div>
  );
}
