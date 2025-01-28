import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI); // Ensure MONGO_URI is correctly set in your Netlify environment variables
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
