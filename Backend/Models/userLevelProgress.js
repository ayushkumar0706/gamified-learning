const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * UserLevelProgress
 *
 * Tracks which career levels a user has officially cleared.
 * One document per user-level pair. Created when a user successfully
 * clears all clearanceCriteria for a level.
 */
const userLevelProgressSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },

  clearedAt: {
    type: Date,
    default: Date.now
  },

  xpAwarded: {
    type: Number,
    default: 0
  },

  // Snapshot of the badge awarded at clearance (for display purposes)
  badgeAwarded: {
    badgeId:     { type: String },
    name:        { type: String },
    icon:        { type: String },
    description: { type: String }
  }

}, { timestamps: true });

// Each user can only clear a given level once
userLevelProgressSchema.index({ user: 1, level: 1 }, { unique: true });

// Fast lookup: all cleared levels for a user
userLevelProgressSchema.index({ user: 1, clearedAt: -1 });

module.exports = mongoose.model('UserLevelProgress', userLevelProgressSchema);
