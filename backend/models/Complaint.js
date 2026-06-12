const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title:       { type: String, required: true },
  category:    { type: String, enum: ['Plumbing', 'Electrical', 'Cleanliness', 'Wi-Fi', 'Mess Food', 'Other'], required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status:      { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
  description: { type: String },
  resolvedAt:  { type: Date },
  resolvedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Auto-generate complaintId
complaintSchema.pre('save', async function (next) {
  if (!this.complaintId) {
    const count = await mongoose.model('Complaint').countDocuments();
    this.complaintId = `C${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
