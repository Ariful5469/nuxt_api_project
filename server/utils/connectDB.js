import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      const dbURI = 'mongodb://127.0.0.1:27017/customerDB'; // Replace with your database name
 // Replace with your database name
 // Hardcoded URI for local database
      await mongoose.connect(dbURI); // No need for useNewUrlParser and useUnifiedTopology
      console.log('MongoDB Connected');
    }
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

export default connectDB;
