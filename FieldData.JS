// models/FieldData.js

const mongoose = require('mongoose');

const FieldDataSchema = new mongoose.Schema({
  cropType: { type: String, required: true },
  cropStage: { type: String, required: true },
  spacing: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  microNutrients: { type: String, required: false },
  interventionUsed: { type: String, required: true },
  quantityUsed: { type: Number, required: true },
  weather: { type: String, required: true },
  // Add other fields as necessary
}, { timestamps: true });

const FieldData = mongoose.model('FieldData', FieldDataSchema);
module.exports = FieldData;