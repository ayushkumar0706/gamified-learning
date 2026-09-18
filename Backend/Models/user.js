const mongoose = require('mongoose');
const hashPassword = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const userSchema = new Schema({

  // ── Core Identity ──────────────────────────────────
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    immutable: true
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['student', 'senior', 'admin'],
    default: 'student'
  },

  // ── College / Academic ─────────────────────────────
  college: {
    type: Schema.Types.ObjectId,
    ref: 'College',
    default: null
  },
  year: {
    // 1st year, 2nd year, etc.
    type: Number,
    min: 1,
    max: 6,
    default: null
  },
  branch: {
    // e.g. "Computer Science", "IT", "ECE"
    type: String,
    trim: true,
    default: null
  },

  // ── Gamification ───────────────────────────────────
  xp: {
    type: Number,
    default: 0
  },
  level: {
    // Platform level (derived from XP)
    type: Number,
    default: 1
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: null
  },
  badges: [
    {
      badgeId: { type: String },           // e.g. "dsa-warrior"
      name: { type: String },              // e.g. "DSA Warrior"
      icon: { type: String },              // emoji or icon key
      description: { type: String },
      earnedAt: { type: Date, default: Date.now }
    }
  ],

  // ── Profile / Career ───────────────────────────────
  bio: {
    type: String,
    maxlength: 300,
    default: null
  },
  careerGoal: {
    // e.g. "Software Development", "DSA", "Web Development", "Placements"
    type: String,
    trim: true,
    default: null
  },
  currentPreparationLevel: {
    // Onboarding selection: "just-starting" | "learning-dsa" | "building-projects" | "preparing-placements" | "already-applying"
    type: String,
    enum: ['just-starting', 'learning-dsa', 'building-projects', 'preparing-placements', 'already-applying'],
    default: 'just-starting'
  },

  // ── Social Links ───────────────────────────────────
  github: {
    type: String,
    trim: true,
    default: null
  },
  linkedin: {
    type: String,
    trim: true,
    default: null
  },
  leetcode: {
    type: String,
    trim: true,
    default: null
  },
  codeforces: {
    type: String,
    trim: true,
    default: null
  },

  // ── Privacy ────────────────────────────────────────
  profileVisibility: {
    type: String,
    enum: ['public', 'college-only', 'private'],
    default: 'college-only'
  },

  // ── Onboarding ─────────────────────────────────────
  onboardingComplete: {
    type: Boolean,
    default: false
  },

  // ── Senior Profile ─────────────────────────────────
  seniorProfile: {
    jobTitle: { type: String, default: null },
    company: { type: String, default: null },
    skills: [{ type: String }],
    availableDays: [{ type: String }],
    responseTime: { type: String, default: 'Within 24 hours' }
  },

  // ── Legacy / backward compat ───────────────────────
  age: {
    type: Number,
    min: 14,
    max: 30
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  // keeping old streak field for backward compat
  streak: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: Date
  }

}, { timestamps: true });

// ── Methods ──────────────────────────────────────────────────
userSchema.methods.getJWT = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};

// ── Hooks ─────────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashPassword(this.password);
});

// ── Indexes ───────────────────────────────────────────────────
// For leaderboard queries: find users by college, sorted by xp
userSchema.index({ college: 1, xp: -1 });
userSchema.index({ college: 1, currentStreak: -1 });

module.exports = mongoose.model('User', userSchema);