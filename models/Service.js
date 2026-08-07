const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['Haircut', 'Beard', 'Coloring', 'Facial & Care', 'Combo'], default: 'Haircut' },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, default: 30 },
    image: { type: String, default: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80' },
    barbers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Barber' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
