const mongoose = require('mongoose');
const { Schema } = mongoose;

const missionClaimSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  missionId: {
    type: String, // 'daily-learner', 'quiz-master', 'level-up'
    required: true
  },
  dateStr: {
    type: String, // 'YYYY-MM-DD'
    required: true,
    index: true
  }
}, { timestamps: true });

// Ensure a user can only claim a specific mission once per day
missionClaimSchema.index({ user: 1, missionId: 1, dateStr: 1 }, { unique: true });

module.exports = mongoose.model('MissionClaim', missionClaimSchema);
