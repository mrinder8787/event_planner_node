const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/satya_project';
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
