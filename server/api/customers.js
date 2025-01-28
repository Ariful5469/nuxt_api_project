import connectDB from '../utils/connectDB';
import Customer from '../models/Customer';
import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
  try {
    const origin = event.node.req.headers.origin;

    // CORS
    event.node.res.setHeader("Access-Control-Allow-Origin", origin || "*");
    event.node.res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    event.node.res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    event.node.res.setHeader("Access-Control-Allow-Credentials", "true");

    // Preflight
    if (event.node.req.method === "OPTIONS") {
      event.node.res.statusCode = 204;
      event.node.res.end();
      return;
    }

    // Connect to DB
    await connectDB();

    const method = event.node.req.method;
    const id = event.context.params?.id;

    switch (method) {
      case 'GET':
        if (id) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid ID format');
          }
          const customer = await Customer.findById(id);
          if (!customer) {
            throw new Error('Customer not found');
          }
          return customer;
        }
        return await Customer.find();

      case 'POST':
        const body = await readBody(event);
        const newCustomer = new Customer(body);
        await newCustomer.save();
        return newCustomer;

      case 'PUT':
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid or missing ID');
        }
        const updateBody = await readBody(event);
        const updatedCustomer = await Customer.findByIdAndUpdate(id, updateBody, { new: true });
        if (!updatedCustomer) {
          throw new Error('Customer not found');
        }
        return updatedCustomer;

      case 'DELETE':
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid or missing ID');
        }
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
          throw new Error('Customer not found');
        }
        return { message: 'Customer deleted successfully' };

      default:
        throw new Error('Unsupported method');
    }
  } catch (error) {
    console.error('API Error:', error.message);
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
