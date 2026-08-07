import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await API.post('/contact', formData);
      setStatusMsg({ type: 'success', text: res.data.message });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Error submitting message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white">GET IN TOUCH</h1>
        <p className="text-sm text-zinc-400">
          Have questions about our services or need assistance with your booking? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        
        {/* Contact Info & Operating Hours */}
        <div className="space-y-8">
          <div className="bg-dark-800 border border-zinc-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Studio Contact Info</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Location</h4>
                  <p className="text-xs text-zinc-400">742 Evergreen Terrace, Suite 10, Metro City</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Direct Phone</h4>
                  <p className="text-xs text-zinc-400">+1 (555) 019-ROBO (7626)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Email Address</h4>
                  <p className="text-xs text-zinc-400">support@robocutz.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Map Mockup */}
          <div className="bg-dark-800 border border-zinc-800 rounded-2xl overflow-hidden h-52 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40"></div>
            <div className="relative z-10 text-center space-y-2 p-4 bg-black/70 backdrop-blur rounded-xl border border-zinc-700">
              <MapPin className="w-6 h-6 text-gold-400 mx-auto animate-bounce" />
              <p className="text-xs font-bold text-white">RoboCutz Main Barber Studio</p>
              <p className="text-[10px] text-zinc-400">Open in Google Maps / Apple Maps</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-dark-800 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white">Send Us A Message</h2>

          {statusMsg && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help you?"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gold-gradient text-black font-extrabold text-xs shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Inquiry Message</>}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
