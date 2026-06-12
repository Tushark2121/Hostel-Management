const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId:   { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  phone:       { type: String },
  course:      { type: String },
  year:        { type: Number, min: 1, max: 6 },
  rollNumber:  { type: String },
  block:       { type: String, enum: ['Block A', 'Block B', 'Block C'] },
  room:        { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  guardian:    { name: String, phone: String },
  address:     { type: String },
  checkInDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  feeStatus:   { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
