import connectDB from '../utils/connectDB';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

// Define the API handler
export default defineEventHandler(async (event) => {
  // Set up CORS headers
  event.node.res.setHeader("Access-Control-Allow-Origin", "https://wonderful-faloodeh-e3adf5.netlify.app");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  event.node.res.setHeader("Access-Control-Allow-Credentials", "true");

  // Ensure the request body is parsed
  const body = event.node.req.method === 'POST' || event.node.req.method === 'PUT' ? await readBody(event) : null;

  // Connect to the database
  await connectDB();

  const method = event.node.req.method;
  const id = event.context.params?.id;

  try {
    if (method === 'GET') {
      // Fetch all customers or a specific customer by ID
      if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
        }

        const customer = await Customer.findById(id);
        if (!customer) {
          throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
        }
        return customer;
      }

      const customers = await Customer.find();
      return customers;

    } else if (method === 'POST') {
      // Create a new customer
      if (!body) {
        throw createError({ statusCode: 400, statusMessage: 'Request body is missing' });
      }

      const newCustomer = new Customer(body);
      await newCustomer.save();
      return { message: 'Customer created successfully', customer: newCustomer };

    } else if (method === 'PUT') {
      // Update an existing customer
      if (!id || !body) {
        throw createError({ statusCode: 400, statusMessage: 'Customer ID and request body are required for update' });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!updatedCustomer) {
        throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
      }

      return { message: 'Customer updated successfully', customer: updatedCustomer };

    } else if (method === 'DELETE') {
      // Delete a customer
      if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Customer ID is required for deletion' });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
      }

      const deletedCustomer = await Customer.findByIdAndDelete(id);
      if (!deletedCustomer) {
        throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
      }

      return { message: 'Customer deleted successfully' };

    } else {
      // Handle unsupported HTTP methods
      throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
