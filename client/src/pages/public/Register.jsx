import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, User, Mail, Lock, Phone, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gold-gradient mx-auto flex items-center justify-center text-black font-extrabold shadow-xl">
            <Scissors className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white">CREATE ACCOUNT</h1>
          <p className="text-xs text-zinc-400">Join RoboCutz for instant booking and appointment history</p>
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
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
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
              {loading ? 'Creating Account...' : <><UserPlus className="w-4 h-4" /> Register Account</>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 font-bold hover:underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
}
