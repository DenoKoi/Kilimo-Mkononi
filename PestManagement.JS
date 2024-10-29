// models/PestManagement.js

const mongoose = require('mongoose');

const PestManagementSchema = new mongoose.Schema({
  cropType: { type: String, required: true },
  cropStage: { type: String, required: true },
  pestDiseasePicture: { type: String, required: true }, // URL or path to the uploaded image
  pestDiseaseType: { type: String, required: false },
  monitoringDetails: { type: String, required: true },
  preventionStrategies: { type: String, required: true },
  interventionUsed: { type: String, required: true },
  dosageRequired: { type: String, required: true },
  effectivenessEvaluation: { type: String, required: true },
  futureAdaptation: { type: String, required: true },
}, { timestamps: true });

const PestManagement = mongoose.model('PestManagement', PestManagementSchema);
module.exports = PestManagement;