const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number:    { type: String, required: true, unique: true },
  block:     { type: String, enum: ['Block A', 'Block B', 'Block C'], required: true },
  floor:     { type: Number, required: true },
  type:      { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  capacity:  { type: Number, required: true },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  status:    { type: String, enum: ['available', 'partial', 'full', 'maintenance'], default: 'available' },
  amenities: [String],
  monthlyRent: { type: Number, default: 12000 }
}, { timestamps: true });

// Auto-update status based on occupants
roomSchema.pre('save', function (next) {
  const occ = this.occupants.length;
  if (occ === 0) this.status = 'available';
  else if (occ >= this.capacity) this.status = 'full';
  else this.status = 'partial';
  next();
});

module.exports = mongoose.model('Room', roomSchema);
