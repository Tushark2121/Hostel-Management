const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  relation: { type: String, required: true },
  phone:    { type: String },
  student:  { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  inTime:   { type: Date, default: Date.now },
  outTime:  { type: Date },
  status:   { type: String, enum: ['inside', 'out'], default: 'inside' },
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
