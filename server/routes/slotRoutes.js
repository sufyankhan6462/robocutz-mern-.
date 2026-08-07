const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');
const Appointment = require('../models/Appointment');

// Default daily base slots
const BASE_SLOTS = [
  '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
  '12:00 PM', '01:30 PM', '02:15 PM', '03:00 PM',
  '03:45 PM', '04:30 PM', '05:15 PM', '06:00 PM'
];

// @route   GET /api/slots/available
// @desc    Get available time slots for a specific barber on a specific date
router.get('/available', async (req, res) => {
  try {
    const { barberId, date } = req.query;

    if (!barberId || !date) {
      return res.status(400).json({ message: 'barberId and date parameters are required' });
    }

    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }

    // Find existing booked appointments for this barber on this date that are active
    const bookedAppointments = await Appointment.find({
      barber: barberId,
      date,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    const bookedTimes = bookedAppointments.map((app) => app.timeSlot);

    // Calculate slots status
    const slots = BASE_SLOTS.map((slot) => ({
      time: slot,
      available: !bookedTimes.includes(slot),
    }));

    res.json({
      barberId,
      date,
      totalSlots: slots.length,
      availableSlotsCount: slots.filter((s) => s.available).length,
      slots,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
