const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount:     { type: Number, required: true },
  month:      { type: String, required: true },   // e.g. "July 2024"
  dueDate:    { type: Date, required: true },
  paidDate:   { type: Date },
  status:     { type: String, enum: ['paid', 'partial', 'unpaid', 'overdue'], default: 'unpaid' },
  paidAmount: { type: Number, default: 0 },
  remarks:    { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
