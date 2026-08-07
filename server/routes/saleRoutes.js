const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// Helper to generate unique receipt numbers
const generateReceiptNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `RC-${timestamp}-${random}`;
};

// @route   POST /api/sales
// @desc    Record a new POS sale (services + retail products) & update product stock
router.post('/', protect, authorize('admin', 'receptionist'), async (req, res) => {
  try {
    const { customerName, customerPhone, items, discount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty for a POS sale' });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      subtotal += item.price * (item.quantity || 1);
      validatedItems.push({
        itemType: item.itemType,
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      });

      // Auto-update product stock if item is a product
      if (item.itemType === 'Product') {
        const product = await Product.findById(item.itemId);
        if (product) {
          product.stock = Math.max(0, product.stock - (item.quantity || 1));
          await product.save();
        }
      }
    }

    const discountAmount = Number(discount) || 0;
    const total = Math.max(0, subtotal - discountAmount);

    const sale = await Sale.create({
      receiptNo: generateReceiptNumber(),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      receptionist: req.user._id,
      items: validatedItems,
      subtotal,
      discount: discountAmount,
      total,
      paymentMethod: paymentMethod || 'Cash',
    });

    res.status(201).json({
      message: 'Sale recorded successfully!',
      sale,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sales
// @desc    Get sales history
router.get('/', protect, authorize('admin', 'receptionist'), async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('receptionist', 'name email')
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/sales/:id
router.get('/:id', protect, authorize('admin', 'receptionist'), async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('receptionist', 'name email');
    if (!sale) {
      return res.status(404).json({ message: 'Sale receipt not found' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
