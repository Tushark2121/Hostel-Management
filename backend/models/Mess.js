const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
  day:       { type: String, required: true, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  breakfast: { type: String, required: true },
  lunch:     { type: String, required: true },
  dinner:    { type: String, required: true },
  weekLabel: { type: String }   // e.g. "Week of Jul 15, 2024"
}, { timestamps: true });

module.exports = mongoose.model('Mess', messSchema);
