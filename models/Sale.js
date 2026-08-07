const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ['Service', 'Product'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
});

const saleSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true },
    customerName: { type: String, default: 'Walk-in Customer' },
    customerPhone: { type: String, default: '' },
    receptionist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI'], default: 'Cash' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
