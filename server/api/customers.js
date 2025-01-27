import connectDB from '../utils/connectDB';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  await connectDB();
  const method = event.node.req.method;

  // Handler for GET request to fetch customers or a specific customer by ID
  if (method === 'GET') {
    const id = event.context.params?.id;
    if (id) {
      try {
        const customer = await Customer.findById(id);
        if (!customer) {
          throw createError({ statusCode: 404, statusMessage: 'Customer not found' });
        }
        return customer;
      } catch (error) {
        console.error('Error fetching customer by ID:', error);
        throw createError({ statusCode: 500, statusMessage: 'Error fetching customer' });
      }
    }

    try {
      const customers = await Customer.find();
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw createError({ statusCode: 500, statusMessage: 'Error fetching customers' });
    }
  }

  // Handler for POST request to create a new customer
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

  // Handler for PUT request to update a customer
  if (method === 'PUT') {
    const id = event.context.params?.id;
    const body = await readBody(event);

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Customer ID is required for update' });
    }

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid ID format' });
    }

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

  // Handler for DELETE request to delete a customer
  if (method === 'DELETE') {
    const id = event.context.params?.id;

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Customer ID is required for deletion' });
    }

    // Check if the ID is valid
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
});
