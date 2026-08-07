const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    customerPhone: { type: String, required: true },
    barber: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: String, required: true }, // Format YYYY-MM-DD
    timeSlot: { type: String, required: true }, // e.g. "10:00 AM"
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'confirmed',
    },
    notes: { type: String, default: '' },
    totalPrice: { type: Number, required: true },
    isWalkIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
