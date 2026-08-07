const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Barber = require('../models/Barber');
const { protect, authorize } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (appointment, email, type = 'customer') => {
  if (!email) return;
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const isBarber = type === 'barber';
    const subject = isBarber ? 'New Booking Alert! ✂️' : 'Your Appointment is Confirmed! ✂️';
    const title = isBarber ? 'New Booking Received' : 'Booking Confirmation';
    const greeting = isBarber ? `Hi <strong>${appointment.barber.name}</strong>,` : `Hi <strong>${appointment.customerName}</strong>,`;
    const message = isBarber 
      ? `You have a new appointment scheduled with ${appointment.customerName}.`
      : `Your appointment at RoboCutz has been successfully booked.`;

    const info = await transporter.sendMail({
      from: '"RoboCutz Studio" <no-reply@robocutz.com>',
      to: email,
      subject: subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #111; color: #fff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #d4af37; text-align: center;">${title}</h2>
          <p>${greeting}</p>
          <p>${message}</p>
          <div style="background-color: #222; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <ul style="list-style: none; padding: 0; line-height: 2;">
              ${isBarber ? `<li><strong>Customer:</strong> ${appointment.customerName} (${appointment.customerPhone})</li>` : ''}
              <li><strong>Service:</strong> ${appointment.service.name}</li>
              ${!isBarber ? `<li><strong>Barber:</strong> ${appointment.barber.name}</li>` : ''}
              <li><strong>Date:</strong> ${appointment.date}</li>
              <li><strong>Time:</strong> ${appointment.timeSlot}</li>
              <li><strong>Price:</strong> $${appointment.totalPrice}</li>
            </ul>
          </div>
          <p style="text-align: center; margin-top: 20px; color: #aaa;">RoboCutz Management System</p>
        </div>
      `,
    });
    console.log("=========================================");
    console.log(`📧 Ethereal Email Sent to (${type}):`, email);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    console.log("=========================================");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

// @route   POST /api/appointments
// @desc    Create/Book a new appointment
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, barberId, serviceId, date, timeSlot, notes, isWalkIn } = req.body;

    if (!customerName || !customerPhone || !barberId || !serviceId || !date || !timeSlot) {
      return res.status(400).json({ message: 'Missing required appointment fields' });
    }

    // Check if slot is already booked for this barber & date
    const existing = await Appointment.findOne({
      barber: barberId,
      date,
      timeSlot,
      status: { $nin: ['cancelled', 'no-show'] },
    });

    if (existing) {
      return res.status(400).json({ message: `Time slot ${timeSlot} on ${date} is already booked for this barber.` });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    let customerId = null;
    if (req.headers.authorization) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'robocutz_super_secret_jwt_key_2026');
        customerId = decoded.id;
      } catch (err) {
        // Optional customer auth
      }
    }

    const appointment = await Appointment.create({
      customer: customerId,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      barber: barberId,
      service: serviceId,
      date,
      timeSlot,
      totalPrice: service.price,
      notes: notes || '',
      isWalkIn: Boolean(isWalkIn),
      status: 'confirmed',
    });

    const populated = await Appointment.findById(appointment._id)
      .populate({
        path: 'barber',
        select: 'name photo specialties user',
        populate: { path: 'user', select: 'email' }
      })
      .populate('service', 'name price durationMinutes');

    // Trigger Email Asynchronously for Customer
    sendConfirmationEmail(populated, customerEmail, 'customer');
    
    // Trigger Email Asynchronously for Barber
    if (populated.barber && populated.barber.user && populated.barber.user.email) {
      sendConfirmationEmail(populated, populated.barber.user.email, 'barber');
    }

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointment: populated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/appointments
// @desc    Get appointments (Customer gets theirs; Staff/Admin gets all with filters)
router.get('/', protect, async (req, res) => {
  try {
    const { barberId, date, status, customerId } = req.query;
    let query = {};

    if (req.user.role === 'customer') {
      query.$or = [{ customer: req.user._id }, { customerEmail: req.user.email }];
    } else if (req.user.role === 'barber') {
      const barber = await Barber.findOne({ user: req.user._id });
      if (barber) {
        query.barber = barber._id;
      }
    }

    if (barberId) query.barber = barberId;
    if (date) query.date = date;
    if (status && status !== 'All') query.status = status;
    if (customerId) query.customer = customerId;

    const appointments = await Appointment.find(query)
      .populate('barber', 'name photo specialties')
      .populate('service', 'name price durationMinutes')
      .populate('customer', 'name email phone')
      .sort({ date: -1, timeSlot: 1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status (confirm, completed, cancelled, no-show)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ message: 'Invalid appointment status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Customer can only cancel their own appointment
    if (req.user.role === 'customer') {
      if (
        appointment.customer &&
        appointment.customer.toString() !== req.user._id.toString() &&
        appointment.customerEmail !== req.user.email
      ) {
        return res.status(403).json({ message: 'Not authorized to modify this appointment' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({ message: 'Customers can only cancel appointments' });
      }
    }

    appointment.status = status;
    await appointment.save();

    const updated = await Appointment.findById(appointment._id)
      .populate('barber', 'name photo')
      .populate('service', 'name price');

    res.json({ message: `Appointment status updated to ${status}`, appointment: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/appointments/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment removed permanently' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
