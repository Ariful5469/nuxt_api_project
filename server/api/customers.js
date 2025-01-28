import connectDB from '../utils/connectDB';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  const origin = event.node.req.headers.origin;

  // Handle CORS
  event.node.res.setHeader("Access-Control-Allow-Origin", origin || "*");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  event.node.res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  event.node.res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (event.node.req.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }

  // Connect to the database
  await connectDB();

  const method = event.node.req.method;
  const id = event.context.params?.id;

  try {
    if (method === 'GET') {
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
    }

    if (method === 'POST') {
      const body = await readBody(event);
      const newCustomer = new Customer(body);

      try {
        await newCustomer.save();
        return newCustomer;
      } catch (error) {
        console.error('Error saving customer:', error);
        throw createError({ statusCode: 500, statusMessage: 'Error saving customer' });
      }
    }

    if (method === 'PUT') {
      if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Customer ID is required for update' });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
      }

      const body = await readBody(event);

      try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, body, {
          new: true,
          runValidators: true
        });

        if (!updatedCustomer) {
          throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
        }

        return updatedCustomer;
      } catch (error) {
        console.error('Error updating customer:', error);
        throw createError({ statusCode: 500, statusMessage: 'Error updating customer' });
      }
    }

    if (method === 'DELETE') {
      if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Customer ID is required for deletion' });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
      }

      try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
          throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
        }

        return { message: 'Customer deleted successfully' };
      } catch (error) {
        console.error('Error deleting customer:', error);
        throw createError({ statusCode: 500, statusMessage: 'Error deleting customer' });
      }
    }

    // Handle unsupported HTTP methods
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message || 'Internal Server Error' });
  }
});
