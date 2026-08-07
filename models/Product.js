const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['Styling', 'Beard Care', 'Shampoo', 'Skin & Face', 'Tools'], default: 'Styling' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
