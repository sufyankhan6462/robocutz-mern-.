const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Barber = require('../models/Barber');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'robocutz_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
// @desc    Register a new customer account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      let barberId = null;
      if (user.role === 'barber') {
        const barberObj = await Barber.findOne({ user: user._id });
        if (barberObj) barberId = barberObj._id;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        barberId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let barberId = null;
    if (user.role === 'barber') {
      const barberObj = await Barber.findOne({ user: user._id });
      if (barberObj) barberId = barberObj._id;
    }
    res.json({ ...user.toObject(), barberId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/create-staff
// @desc    Admin endpoint to create barber/receptionist accounts
router.post('/create-staff', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only Admin can create staff accounts' });
    }

    const { name, email, password, role, phone, specialties, experience, bio } = req.body;
    if (!['barber', 'receptionist', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid staff role specified' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
    });

    if (role === 'barber') {
      await Barber.create({
        user: newUser._id,
        name: newUser.name,
        specialties: specialties ? specialties.split(',').map((s) => s.trim()) : ['Fade', 'Styling'],
        experience: experience || '3+ years',
        bio: bio || 'Professional Master Barber at RoboCutz.',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      });
    }

    res.status(201).json({
      message: `${role} account created successfully`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
