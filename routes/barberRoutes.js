const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/barbers
// @desc    Get list of all barbers (with optional specialty filter / search)
router.get('/', async (req, res) => {
  try {
    const { specialty, search } = req.query;
    let query = {};

    if (specialty && specialty !== 'All') {
      query.specialties = { $regex: specialty, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { specialties: { $regex: search, $options: 'i' } },
      ];
    }

    const barbers = await Barber.find(query).populate('user', 'name email phone');
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/barbers/:id
// @desc    Get single barber by ID
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id).populate('user', 'name email phone');
    if (!barber) {
      return res.status(404).json({ message: 'Barber profile not found' });
    }
    res.json(barber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/barbers
// @desc    Create a new barber profile (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const barber = await Barber.create(req.body);
    res.status(201).json(barber);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/barbers/:id
// @desc    Update barber profile (Admin or the Barber themselves)
router.put('/:id', protect, authorize('admin', 'barber'), async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    Object.assign(barber, req.body);
    const updated = await barber.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/barbers/:id
// @desc    Delete barber profile (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    await Barber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Barber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
