const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/robocutz';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB connection failed (${error.message}). Initializing MongoDB Memory Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Connected to MongoDB Memory Server at: ${uri}`);
    } catch (memError) {
      console.error(`[Database] Could not start MongoDB Memory Server:`, memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
