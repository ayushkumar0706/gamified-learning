const mongoose = require('mongoose');
const { Schema } = mongoose;

const xpLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['quiz', 'level-clear', 'other'],
    default: 'other'
  }
}, { timestamps: true });

// Index for efficient weekly/monthly aggregation
xpLogSchema.index({ college: 1, createdAt: -1 });

module.exports = mongoose.model('XPLog', xpLogSchema);
