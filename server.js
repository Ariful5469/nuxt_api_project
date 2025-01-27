<<<<<<< HEAD
import express from 'express';
import cors from 'cors';
import connectDB from './utils/connectDB';
import customerRoutes from './routes/customers'; // Assuming routes are in a separate file

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// CORS Configuration
app.use(cors({
  origin: 'https://wonderful-faloodeh-e3adf5.netlify.app', // Replace with your actual Netlify URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

// Connect to the database
connectDB();

// Define routes
app.use('/api/customers', customerRoutes); // Assuming customers routes are defined in 'customers.js'

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
=======
import express from 'express';
import cors from 'cors';
import connectDB from './utils/connectDB';  // Update the path based on your folder structure
import customerRoutes from './routes/customers'; // Assuming routes are in a separate file

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// CORS Configuration
app.use(cors({
  origin: 'https://wonderful-faloodeh-e3adf5.netlify.app',  // Replace with your front-end URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers in requests
}));

// Connect to the database
connectDB();

// Define routes
app.use('/api/customers', customerRoutes);  // Assuming customers routes are defined in 'customers.js'

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> cb308ab59755ff3720cdd50b3f66bcc1c25578d4
