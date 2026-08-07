const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database and Auto-Seed
const seedDatabase = require('./seed');
const User = require('./models/User');

connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] Empty database detected. Seeding now...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Error during auto-seed check:', err);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/barbers', require('./routes/barberRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/slots', require('./routes/slotRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Healthcheck Route
app.get('/api/health', async (req, res) => {
  const User = require('./models/User');
  let count = 0;
  try {
    count = await User.countDocuments();
  } catch (e) {}
  res.json({
    status: 'online',
    app: 'RoboCutz Barber Shop API',
    users: count,
    timestamp: new Date(),
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Error Middleware]:', err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] RoboCutz Express Backend running on port ${PORT} (ENV: ${process.env.NODE_ENV || 'development'})`);
});
