const mongoose = require('mongoose');
const { Schema } = mongoose;

const collegeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  domain: {
    // e.g. "iitb.ac.in" — for auto-matching student emails
    type: String,
    trim: true,
    lowercase: true
  },
  logo: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Text index for fast search
collegeSchema.index({ name: 'text', city: 'text', state: 'text' });

module.exports = mongoose.model('College', collegeSchema);
