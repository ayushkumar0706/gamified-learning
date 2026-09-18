const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, required: true }, // Emoji for MVP
  location: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'Full-time', 'Internship'
  batch: { type: String, required: true }, // e.g. '2025 / 2026 Batch'
  ctc: { type: String, required: true },
  description: { type: String, required: true },
  applyUrl: { type: String, required: true },
  skills: [{ type: String }],
  referralAvailable: { type: Boolean, default: false },
  seniorReferrer: { type: String, default: null }, // Mock name for now
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
