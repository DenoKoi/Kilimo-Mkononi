// models/FarmManagement.js
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  cropType: { type: String, required: true },
  cropStage: { type: String, required: true },
  landArea: { type: Number, required: true },
  labourActivity: { type: String, required: true },
  labourCost: { type: Number, required: true },
  equipmentUsed: { type: String, required: false },
  equipmentCost: { type: Number, required: true },
  inputUsed: { type: String, required: false },
  inputCost: { type: Number, required: true },
  manHours: { type: Number, required: true },
  manHoursCost: { type: Number, required: true },
  costProduction: { type: Number, required: true },
  marketPrice: { type: Number, required: true },
  totalUnits: { type: Number, required: true },
  revenue: { type: Number, required: true },
  profitLoss: { type: Number, required: true },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  loanInterest: { type: Number, required: true },
  loanRepayment: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  paymentHistory: [{
    paymentDate: { type: Date, required: true },
    paymentAmount: { type: Number, required: true },
    remainingBalance: { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Farm', farmSchema);