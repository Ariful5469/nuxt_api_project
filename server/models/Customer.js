// Default export of the Customer model
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; // Default export
