// models/Farmer.js
const mongoose = require('mongoose');

// Farmer model schema
const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  farmLocation: { type: String, required: true },
  productionAmount: { type: Number, required: true },
  loanTaken: { type: Boolean, default: false } // Defaults to false if not provided
});

const Farmer = mongoose.model('Farmer', FarmerSchema);
module.exports = Farmer; // Export the model
