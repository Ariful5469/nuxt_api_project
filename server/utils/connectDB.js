import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      // Use the environment variable for the MongoDB URI
      const dbURI = process.env.MONGO_URI;

      // Connecting to MongoDB Atlas without the deprecated options
      await mongoose.connect(dbURI);  // No need for useNewUrlParser and useUnifiedTopology
      
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;
