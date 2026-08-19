// Models/progress.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const progressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true
  },
  status: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started"
  },
  bestScorePercentage: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });


progressSchema.index({ user: 1, topic: 1 }, { unique: true });


module.exports = mongoose.model("Progress", progressSchema);