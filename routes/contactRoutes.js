const express = require('express');
const router = express.Router();

// @route   POST /api/contact
// @desc    Receive customer contact form inquiries
router.post('/', (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields (name, email, message)' });
    }

    console.log(`[Contact Form] Inquiry from ${name} (${email}, ${phone || 'N/A'}): ${message}`);

    res.json({
      success: true,
      message: 'Thank you for reaching out to RoboCutz! Our team will contact you shortly.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
