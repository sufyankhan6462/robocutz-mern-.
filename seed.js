const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Barber = require('./models/Barber');
const Service = require('./models/Service');
const Product = require('./models/Product');
const Appointment = require('./models/Appointment');
const Sale = require('./models/Sale');

dotenv.config();

const seedDatabase = async () => {
  try {
    // await connectDB(); // Removed so we reuse the existing connection
    console.log('[Seed] Clearing existing database collections...');

    await User.deleteMany({});
    await Barber.deleteMany({});
    await Service.deleteMany({});
    await Product.deleteMany({});
    await Appointment.deleteMany({});
    await Sale.deleteMany({});

    console.log('[Seed] Creating core User accounts...');

    // 1. Admin User
    const adminUser = await User.create({
      name: 'Master Admin',
      email: 'admin@robocutz.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
    });

    // 2. Receptionist User
    const receptionistUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'receptionist@robocutz.com',
      password: 'receptionist123',
      role: 'receptionist',
      phone: '+1 (555) 014-9912',
    });

    // 3. Barber Users
    const barberUser1 = await User.create({
      name: 'Marcus Vance',
      email: 'barber@robocutz.com',
      password: 'barber123',
      role: 'barber',
      phone: '+1 (555) 012-3456',
    });

    const barberUser2 = await User.create({
      name: 'David Miller',
      email: 'david@robocutz.com',
      password: 'barber123',
      role: 'barber',
      phone: '+1 (555) 017-8821',
    });

    // 4. Customer User
    const customerUser = await User.create({
      name: 'Alex Johnson',
      email: 'customer@robocutz.com',
      password: 'customer123',
      role: 'customer',
      phone: '+1 (555) 018-4433',
    });

    console.log('[Seed] Creating Barber profiles...');

    const barber1 = await Barber.create({
      user: barberUser1._id,
      name: 'Marcus "The Blade" Vance',
      photo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      specialties: ['Skin Fade', 'Beard Sculpting', 'Hot Towel Shave'],
      experience: '8+ years',
      bio: 'Master Barber specializing in precise skin fades, razor outlines, and modern pompadours.',
      rating: 4.9,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    });

    const barber2 = await Barber.create({
      user: barberUser2._id,
      name: 'David "Razor" Miller',
      photo: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80',
      specialties: ['Classic Cut', 'Hair Coloring', 'Kids Haircut'],
      experience: '6+ years',
      bio: 'Expert in classic scissor cuts, executive styling, and vibrant hair tones.',
      rating: 4.8,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    });

    const barber3 = await Barber.create({
      name: 'Elena Rostova',
      photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&auto=format&fit=crop&q=80',
      specialties: ['Styling & Blowout', 'Facial Care', 'Beard Trim'],
      experience: '5+ years',
      bio: 'Creative groomer dedicated to customized facial care, hair treatment, and modern cuts.',
      rating: 4.95,
      workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    });

    console.log('[Seed] Creating Services...');

    const service1 = await Service.create({
      name: 'Classic Executive Haircut',
      category: 'Haircut',
      description: 'Precision scissor and clipper cut, finished with razor neck clean-up and styling.',
      price: 35,
      durationMinutes: 30,
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80',
      barbers: [barber1._id, barber2._id, barber3._id],
    });

    const service2 = await Service.create({
      name: 'Beard Sculpting & Royal Hot Towel Shave',
      category: 'Beard',
      description: 'Beard shaping, razor edge alignment, hot towel treatment, and moisturizing essential oils.',
      price: 28,
      durationMinutes: 25,
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
      barbers: [barber1._id, barber3._id],
    });

    const service3 = await Service.create({
      name: 'RoboCutz VIP Combo (Cut + Beard + Facial)',
      category: 'Combo',
      description: 'The ultimate grooming package: Executive Cut, Royal Beard Shave, and Detox Facial.',
      price: 75,
      durationMinutes: 60,
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
      barbers: [barber1._id, barber2._id],
    });

    const service4 = await Service.create({
      name: 'Gentleman Hair Coloring & Grey Blending',
      category: 'Coloring',
      description: 'Natural grey coverage or modern highlights using premium ammonia-free dye.',
      price: 50,
      durationMinutes: 45,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
      barbers: [barber2._id],
    });

    console.log('[Seed] Creating Products...');

    const prod1 = await Product.create({
      name: 'Matte Clay Hair Pomade (100g)',
      category: 'Styling',
      price: 22,
      stock: 25,
      description: 'High hold matte finish clay for structured modern hairstyles.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    });

    const prod2 = await Product.create({
      name: 'Organic Cedarwood Beard Oil (50ml)',
      category: 'Beard Care',
      price: 18,
      stock: 18,
      description: 'Deeply nourishes facial hair and skin, reducing itchiness and adding natural shine.',
      image: 'https://images.unsplash.com/photo-1608248597309-8472506e788e?w=600&auto=format&fit=crop&q=80',
    });

    const prod3 = await Product.create({
      name: 'Tea Tree Refreshing Shampoo (250ml)',
      category: 'Shampoo',
      price: 20,
      stock: 12,
      description: 'Invigorating daily shampoo infused with tea tree oil and peppermint extract.',
      image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Creating sample Appointments & POS Sales...');

    const todayStr = new Date().toISOString().split('T')[0];

    await Appointment.create({
      customer: customerUser._id,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      customerPhone: customerUser.phone,
      barber: barber1._id,
      service: service1._id,
      date: todayStr,
      timeSlot: '10:30 AM',
      totalPrice: service1.price,
      status: 'confirmed',
      notes: 'Prefers low skin fade.',
    });

    await Appointment.create({
      customerName: 'Robert Vance',
      customerEmail: 'robert@gmail.com',
      customerPhone: '+1 (555) 998-1122',
      barber: barber2._id,
      service: service3._id,
      date: todayStr,
      timeSlot: '02:15 PM',
      totalPrice: service3.price,
      status: 'completed',
      isWalkIn: true,
    });

    await Sale.create({
      receiptNo: 'RC-892102-101',
      customerName: 'Daniel Craig',
      customerPhone: '+1 (555) 777-3344',
      receptionist: receptionistUser._id,
      items: [
        { itemType: 'Service', itemId: service1._id, name: service1.name, price: service1.price, quantity: 1 },
        { itemType: 'Product', itemId: prod1._id, name: prod1.name, price: prod1.price, quantity: 1 },
      ],
      subtotal: 57,
      discount: 5,
      total: 52,
      paymentMethod: 'Card',
    });

    console.log('[Seed] Database successfully populated!');
    console.log('----------------------------------------------------');
    console.log('Default Credentials:');
    console.log('Admin:        admin@robocutz.com       / admin123');
    console.log('Receptionist: receptionist@robocutz.com / receptionist123');
    console.log('Barber:       barber@robocutz.com       / barber123');
    console.log('Customer:     customer@robocutz.com     / customer123');
    console.log('----------------------------------------------------');
    // process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    // process.exit(1);
  }
};

module.exports = seedDatabase;
