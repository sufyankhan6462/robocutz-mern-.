const mongoose = require('mongoose');

const barberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    photo: { type: String, default: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80' },
    specialties: [{ type: String }],
    experience: { type: String, default: '5+ years' },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 4.9 },
    workingDays: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' },
    },
    slotDurationMinutes: { type: Number, default: 45 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Barber', barberSchema);
