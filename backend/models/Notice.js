const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  type:    { type: String, enum: ['general', 'urgent', 'info'], default: 'general' },
  postedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
