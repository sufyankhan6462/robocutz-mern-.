const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Sale = require('../models/Sale');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/reports/dashboard-stats
// @desc    Get dashboard metrics snapshot
router.get('/dashboard-stats', protect, authorize('admin', 'receptionist', 'barber'), async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayAppointments = await Appointment.countDocuments({ date: todayStr });
    const todaySales = await Sale.find({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });

    const todaySalesTotal = todaySales.reduce((acc, s) => acc + s.total, 0);

    const completedAppointments = await Appointment.find({ status: 'completed' });
    const appointmentRevenue = completedAppointments.reduce((acc, a) => acc + a.totalPrice, 0);

    const allSales = await Sale.find();
    const posRevenue = allSales.reduce((acc, s) => acc + s.total, 0);

    const totalRevenue = appointmentRevenue + posRevenue;
    const totalBarbers = await Barber.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      todayAppointments,
      todayWalkinSalesCount: todaySales.length,
      todaySalesTotal,
      totalRevenue,
      totalBarbers,
      totalServices,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/reports/analytics
// @desc    Get visual charts analytics data
router.get('/analytics', protect, authorize('admin', 'receptionist'), async (req, res) => {
  try {
    // 7 Days Revenue Trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({ dateStr, dayName, revenue: 0, appointments: 0 });
    }

    // Populate appointment stats per day
    const allAppointments = await Appointment.find();
    allAppointments.forEach((app) => {
      const target = last7Days.find((d) => d.dateStr === app.date);
      if (target) {
        target.appointments += 1;
        if (app.status === 'completed' || app.status === 'confirmed') {
          target.revenue += app.totalPrice;
        }
      }
    });

    // Populate POS sale stats per day
    const allSales = await Sale.find();
    allSales.forEach((sale) => {
      const saleDateStr = new Date(sale.createdAt).toISOString().split('T')[0];
      const target = last7Days.find((d) => d.dateStr === saleDateStr);
      if (target) {
        target.revenue += sale.total;
      }
    });

    // Appointment Status distribution
    const statusCounts = {
      confirmed: await Appointment.countDocuments({ status: 'confirmed' }),
      completed: await Appointment.countDocuments({ status: 'completed' }),
      pending: await Appointment.countDocuments({ status: 'pending' }),
      cancelled: await Appointment.countDocuments({ status: 'cancelled' }),
      noShow: await Appointment.countDocuments({ status: 'no-show' }),
    };

    res.json({
      revenueTrend: last7Days,
      statusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
