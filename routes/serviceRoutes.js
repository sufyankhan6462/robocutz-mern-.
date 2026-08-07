const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/services
// @desc    Get list of all services
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const services = await Service.find(query).populate('barbers', 'name photo');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('barbers', 'name photo specialties');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/services
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/services/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    Object.assign(service, req.body);
    const updated = await service.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/services/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
