import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Scissors, User, Check, AlertCircle, Sparkles, ChevronRight, Phone, Mail } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ isOpen, onClose, initialBarberId = null, initialServiceId = null }) {
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);

  // Form selections
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Customer contact info
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');

  // Status states
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Barbers and Services
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [barberRes, serviceRes] = await Promise.all([
          API.get('/barbers'),
          API.get('/services'),
        ]);
        setBarbers(barberRes.data);
        setServices(serviceRes.data);

        if (initialBarberId) {
          const found = barberRes.data.find((b) => b._id === initialBarberId);
          if (found) setSelectedBarber(found);
        }
        if (initialServiceId) {
          const foundS = serviceRes.data.find((s) => s._id === initialServiceId);
          if (foundS) setSelectedService(foundS);
        }
      } catch (err) {
        console.error('Error loading barbers/services:', err);
      }
    };

    fetchData();
  }, [isOpen, initialBarberId, initialServiceId]);

  // Sync user info if available
  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }
  }, [user]);

  // Fetch available slots whenever Barber or Date changes
  useEffect(() => {
    if (!selectedBarber || !selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await API.get(`/slots/available?barberId=${selectedBarber._id}&date=${selectedDate}`);
        setAvailableSlots(res.data.slots || []);
      } catch (err) {
        console.error('Error fetching available slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedBarber, selectedDate]);

  if (!isOpen) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!selectedBarber || !selectedService || !selectedDate || !selectedSlot) {
      setErrorMessage('Please select a barber, service, date, and time slot.');
      return;
    }
    if (!customerName || !customerPhone) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        barberId: selectedBarber._id,
        serviceId: selectedService._id,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes,
      };

      const res = await API.post('/appointments', payload);
      setBookingSuccess(res.data.appointment);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setBookingSuccess(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-dark-800 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-700/60 bg-dark-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-black font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Book Appointment</h2>
              <p className="text-xs text-zinc-400">RoboCutz Barber Shop & Studio</p>
            </div>
          </div>
          <button onClick={resetAndClose} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker (If not completed) */}
        {!bookingSuccess && (
          <div className="px-6 py-3 bg-zinc-900/50 border-b border-zinc-800 flex justify-between text-xs font-semibold text-zinc-400">
            <span className={step >= 1 ? 'text-gold-400' : ''}>1. Barber</span>
            <span className={step >= 2 ? 'text-gold-400' : ''}>2. Service</span>
            <span className={step >= 3 ? 'text-gold-400' : ''}>3. Date & Slot</span>
            <span className={step >= 4 ? 'text-gold-400' : ''}>4. Confirm</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">

          {/* Success Screen */}
          {bookingSuccess ? (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white">Booking Confirmed!</h3>
                <p className="text-sm text-zinc-300">Your appointment at RoboCutz has been scheduled.</p>
              </div>

              <div className="max-w-md mx-auto bg-dark-900 border border-zinc-800 rounded-xl p-4 text-left text-sm space-y-2">
                <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Customer Name:</span>
                  <span className="text-white font-medium">{bookingSuccess.customerName}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Barber:</span>
                  <span className="text-gold-400 font-medium">{selectedBarber?.name}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Service:</span>
                  <span className="text-white font-medium">{selectedService?.name} (${selectedService?.price})</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Date & Time:</span>
                  <span className="text-emerald-400 font-semibold">{bookingSuccess.date} @ {bookingSuccess.timeSlot}</span>
                </div>
              </div>

              <div className="bg-gold-500/10 border border-gold-500/20 rounded-lg p-3 text-xs text-gold-300">
                📧 A confirmation email & SMS reminder has been sent to <strong>{bookingSuccess.customerEmail || 'your contact details'}</strong>.
              </div>

              <button
                onClick={resetAndClose}
                className="w-full py-3 rounded-xl gold-gradient text-black font-bold shadow-lg"
              >
                Done / Back to Home
              </button>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* Step 1: Barber Selector */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-gold-400" />
                    Select Your Barber
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {barbers.map((b) => (
                      <div
                        key={b._id}
                        onClick={() => setSelectedBarber(b)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          selectedBarber?._id === b._id
                            ? 'bg-gold-500/15 border-gold-500 ring-1 ring-gold-500'
                            : 'bg-dark-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <img src={b.photo} alt={b.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{b.name}</h4>
                          <p className="text-xs text-gold-400">{b.experience} • Rating {b.rating}★</p>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">{b.specialties?.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={!selectedBarber}
                    onClick={() => setStep(2)}
                    className="w-full mt-4 py-3 rounded-xl gold-gradient text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    Next: Choose Service <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Service Selector */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-gold-400" />
                    Select Service
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {services.map((s) => (
                      <div
                        key={s._id}
                        onClick={() => setSelectedService(s)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedService?._id === s._id
                            ? 'bg-gold-500/15 border-gold-500 ring-1 ring-gold-500'
                            : 'bg-dark-900 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-white">{s.name}</h4>
                          <span className="text-sm font-extrabold text-gold-400">${s.price}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2">{s.description}</p>
                        <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                          ⏱ {s.durationMinutes} mins
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      disabled={!selectedService}
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 rounded-xl gold-gradient text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                    >
                      Next: Choose Date & Slot <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Slot Selector */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    Select Appointment Date & Time Slot
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Select Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-dark-900 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2">
                      Available Time Slots ({selectedBarber?.name})
                    </label>

                    {loadingSlots ? (
                      <div className="py-8 text-center text-xs text-zinc-400">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        Checking real-time slot availability...
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                        {availableSlots.map((slotObj, idx) => (
                          <button
                            key={idx}
                            disabled={!slotObj.available}
                            onClick={() => setSelectedSlot(slotObj.time)}
                            className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                              selectedSlot === slotObj.time
                                ? 'bg-gold-500 text-black border-gold-400 font-bold'
                                : slotObj.available
                                ? 'bg-dark-900 border-zinc-800 text-zinc-200 hover:border-gold-500/50'
                                : 'bg-zinc-900/50 border-zinc-800/40 text-zinc-600 cursor-not-allowed line-through'
                            }`}
                          >
                            {slotObj.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      disabled={!selectedSlot}
                      onClick={() => setStep(4)}
                      className="flex-1 py-3 rounded-xl gold-gradient text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                    >
                      Next: Contact & Summary <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Contact Info & Review Confirmation */}
              {step === 4 && (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    Your Contact Information & Review
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-zinc-400 mb-1">Email Address (for confirmation receipt)</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs text-zinc-400 mb-1">Special Notes / Haircut Instructions</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Skin fade on sides, hot towel shave..."
                        className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-zinc-700 text-white text-xs focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-dark-900 border border-zinc-800 rounded-xl p-4 text-xs space-y-1.5">
                    <div className="flex justify-between text-zinc-400">
                      <span>Barber:</span>
                      <span className="text-white font-medium">{selectedBarber?.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Service:</span>
                      <span className="text-white font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Date & Time:</span>
                      <span className="text-gold-400 font-semibold">{selectedDate} at {selectedSlot}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-zinc-800 pt-2 mt-2">
                      <span>Total Amount:</span>
                      <span className="text-gold-400 text-sm">${selectedService?.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-3 rounded-xl gold-gradient text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {submitting ? 'Confirming Appointment...' : 'Confirm & Book Now'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
