const mongoose = require('mongoose');
const { Schema } = mongoose;

const levelSchema = new Schema({

  // ── Core ──────────────────────────────────────────
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  order: {
    type: Number,
    required: true,
    unique: true
  },

  // ── Visual / Gamification ─────────────────────────
  icon: {
    // emoji or icon identifier, e.g. "🌱", "🧠", "🚀"
    type: String,
    default: '📚'
  },
  color: {
    // Tailwind-compatible or hex color for this level's accent
    // e.g. "#10B981" for emerald, "#6366F1" for indigo
    type: String,
    default: '#6366F1'
  },
  xpRequired: {
    // XP a user must accumulate within this level to be eligible for clearance
    type: Number,
    default: 0
  },
  xpReward: {
    // XP awarded on completing / clearing this level
    type: Number,
    default: 500
  },

  // ── Badge unlock on clearance ─────────────────────
  badgeUnlocked: {
    badgeId:     { type: String },   // e.g. "dsa-warrior"
    name:        { type: String },   // e.g. "DSA Warrior"
    icon:        { type: String },   // emoji
    description: { type: String }
  },

  // ── Clearance Criteria ────────────────────────────
  // Structured criteria displayed on the Journey page.
  // Fulfilled/not-fulfilled is calculated dynamically per-user.
  clearanceCriteria: [
    {
      criteriaId:  { type: String, required: true }, // e.g. "complete-topics"
      label:       { type: String, required: true }, // "Complete all topics"
      description: { type: String },
      type: {
        // "topic-completion" | "quiz-pass" | "problem-count" | "project" | "challenge"
        type: String,
        enum: ['topic-completion', 'quiz-pass', 'problem-count', 'project', 'challenge', 'manual'],
        default: 'topic-completion'
      },
      targetCount: { type: Number, default: 1 }     // e.g. solve 25 problems
    }
  ],

  // ── Prerequisite ──────────────────────────────────
  prerequisiteLevel: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    default: null
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Level', levelSchema);