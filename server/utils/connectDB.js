import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const dbURI = process.env.MONGO_URI || 
      await mongoose.connect(dbURI);
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;
