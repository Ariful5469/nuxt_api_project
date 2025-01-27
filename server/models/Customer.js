import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer; // ES module export
