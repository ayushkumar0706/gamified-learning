/**
 * badges.js — Canonical badge definitions for the frontend.
 *
 * This is the SINGLE SOURCE OF TRUTH for badge data on the client.
 * Both Achievements.jsx and Profile.jsx import from here.
 *
 * IMPORTANT: badge `id` values here must match:
 *   - Backend/config/badges.js (for badgeController sync)
 *   - user.badges[].badgeId stored in MongoDB
 *   - level seed data badgeUnlocked.badgeId
 *
 * Do NOT duplicate this list in any other file.
 */

export const BADGE_DEFINITIONS = [
  // ── Learning & Topics ─────────────────────────────────────────────────────
  {
    id: 'first-step',
    name: 'First Step',
    icon: '🚀',
    description: 'Complete your very first topic module on LearnUp.',
    category: 'learning',
    rarity: 'Common',
    xpReward: 50,
    checkUnlocked: (s) => (s?.completedTopics ?? 0) >= 1,
    getProgress:   (s) => ({ current: Math.min(1, s?.completedTopics ?? 0), max: 1 }),
  },
  {
    id: 'dsa-initiate',
    name: 'DSA Initiate',
    icon: '🧠',
    description: 'Complete 3 learning topics across any level.',
    category: 'learning',
    rarity: 'Common',
    xpReward: 100,
    checkUnlocked: (s) => (s?.completedTopics ?? 0) >= 3,
    getProgress:   (s) => ({ current: Math.min(3, s?.completedTopics ?? 0), max: 3 }),
  },
  {
    id: 'dsa-warrior',
    name: 'DSA Warrior',
    icon: '⚔️',
    description: 'Complete 6 core topics and build solid foundations.',
    category: 'learning',
    rarity: 'Rare',
    xpReward: 250,
    checkUnlocked: (s) => (s?.completedTopics ?? 0) >= 6,
    getProgress:   (s) => ({ current: Math.min(6, s?.completedTopics ?? 0), max: 6 }),
  },
  {
    id: 'century-xp',
    name: 'Century Pioneer',
    icon: '💎',
    description: 'Accumulate 200 total XP from quizzes and milestones.',
    category: 'learning',
    rarity: 'Common',
    xpReward: 100,
    checkUnlocked: (s) => (s?.xp ?? 0) >= 200,
    getProgress:   (s) => ({ current: Math.min(200, s?.xp ?? 0), max: 200, unit: 'XP' }),
  },
  {
    id: 'grand-master',
    name: 'Grand Master',
    icon: '🏆',
    description: 'Amass 1,000+ total XP across your campus journey.',
    category: 'learning',
    rarity: 'Legendary',
    xpReward: 1000,
    checkUnlocked: (s) => (s?.xp ?? 0) >= 1000,
    getProgress:   (s) => ({ current: Math.min(1000, s?.xp ?? 0), max: 1000, unit: 'XP' }),
  },

  // ── Streaks ───────────────────────────────────────────────────────────────
  {
    id: 'streak-starter',
    name: 'Spark of Habit',
    icon: '⚡',
    description: 'Maintain an active daily learning streak for 2 days.',
    category: 'streak',
    rarity: 'Common',
    xpReward: 50,
    checkUnlocked: (s) => Math.max(s?.streak ?? 0, s?.maxStreak ?? 0) >= 2,
    getProgress:   (s) => ({ current: Math.min(2, Math.max(s?.streak ?? 0, s?.maxStreak ?? 0)), max: 2 }),
  },
  {
    id: 'streak-fire',
    name: 'On Fire',
    icon: '🔥',
    description: 'Maintain a 5-day continuous learning streak.',
    category: 'streak',
    rarity: 'Rare',
    xpReward: 150,
    checkUnlocked: (s) => Math.max(s?.streak ?? 0, s?.maxStreak ?? 0) >= 5,
    getProgress:   (s) => ({ current: Math.min(5, Math.max(s?.streak ?? 0, s?.maxStreak ?? 0)), max: 5 }),
  },
  {
    id: 'streak-legend',
    name: 'Habit Champion',
    icon: '👑',
    description: 'Reach an unbelievable 14-day study streak!',
    category: 'streak',
    rarity: 'Legendary',
    xpReward: 500,
    checkUnlocked: (s) => Math.max(s?.streak ?? 0, s?.maxStreak ?? 0) >= 14,
    getProgress:   (s) => ({ current: Math.min(14, Math.max(s?.streak ?? 0, s?.maxStreak ?? 0)), max: 14 }),
  },

  // ── Quizzes & Scores ──────────────────────────────────────────────────────
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    icon: '🎯',
    description: 'Score 80% or higher on any topic assessment.',
    category: 'score',
    rarity: 'Common',
    xpReward: 80,
    checkUnlocked: (s) => (s?.recentAttempts ?? []).some((a) => a.scorePercentage >= 80),
    getProgress: (s) => {
      const top = Math.max(0, ...(s?.recentAttempts?.map((a) => a.scorePercentage) ?? [0]));
      return { current: Math.min(80, top), max: 80, unit: '%' };
    },
  },
  {
    id: 'perfect-score',
    name: 'Flawless Victory',
    icon: '✨',
    description: 'Achieve a 100% perfect score on a topic quiz.',
    category: 'score',
    rarity: 'Epic',
    xpReward: 300,
    checkUnlocked: (s) => (s?.recentAttempts ?? []).some((a) => a.scorePercentage === 100),
    getProgress: (s) => ({
      current: (s?.recentAttempts ?? []).some((a) => a.scorePercentage === 100) ? 1 : 0,
      max: 1,
    }),
  },

  // ── Career ────────────────────────────────────────────────────────────────
  {
    id: 'senior-mentor',
    name: 'Campus Guide',
    icon: '🎓',
    description: 'Achieve Senior status to mentor juniors in your college.',
    category: 'career',
    rarity: 'Epic',
    xpReward: 400,
    checkUnlocked: (s) => s?.userRole === 'senior' || s?.userRole === 'admin',
    getProgress: (s) => ({
      current: (s?.userRole === 'senior' || s?.userRole === 'admin') ? 1 : 0,
      max: 1,
    }),
  },
  {
    id: 'placement-ready',
    name: 'Placement Ready',
    icon: '💼',
    description: 'Complete 10 topics and reach Platform Level 5.',
    category: 'career',
    rarity: 'Legendary',
    xpReward: 750,
    checkUnlocked: (s) => (s?.completedTopics ?? 0) >= 10 && (s?.level ?? 1) >= 5,
    getProgress: (s) => ({ current: Math.min(10, s?.completedTopics ?? 0), max: 10, unit: 'topics' }),
  },

  // ── Level-clearance badges (awarded by levelClearanceController) ──────────
  // These are stored in user.badges[] by the server and shown on the Profile.
  // They do NOT have client-side checkUnlocked (the server does it).
  // Listed here so Profile and Achievements can display them with correct metadata.
  {
    id: 'foundation-builder',
    name: 'Foundation Builder',
    icon: '🌱',
    description: 'Cleared the Basic level — your journey has begun!',
    category: 'career',
    rarity: 'Rare',
    xpReward: 0,       // XP awarded via level reward, not badge itself
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('foundation-builder'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('foundation-builder') ? 1 : 0, max: 1 }),
  },
  {
    id: 'builder',
    name: 'Builder',
    icon: '🚀',
    description: 'Shipped your first project — from zero to deployed!',
    category: 'career',
    rarity: 'Rare',
    xpReward: 0,
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('builder'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('builder') ? 1 : 0, max: 1 }),
  },
  {
    id: 'resume-ready',
    name: 'Resume Ready',
    icon: '📄',
    description: 'Your resume is polished and placement-ready!',
    category: 'career',
    rarity: 'Rare',
    xpReward: 0,
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('resume-ready'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('resume-ready') ? 1 : 0, max: 1 }),
  },
  {
    id: 'interview-ready',
    name: 'Interview Ready',
    icon: '🎤',
    description: 'Ready to ace any interview room!',
    category: 'career',
    rarity: 'Epic',
    xpReward: 0,
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('interview-ready'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('interview-ready') ? 1 : 0, max: 1 }),
  },
  {
    id: 'job-hunter',
    name: 'Job Hunter',
    icon: '💼',
    description: 'Actively in the hunt — applications sent!',
    category: 'career',
    rarity: 'Epic',
    xpReward: 0,
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('job-hunter'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('job-hunter') ? 1 : 0, max: 1 }),
  },
  {
    id: 'placed',
    name: 'Placed! 🎉',
    icon: '🎓',
    description: 'Placed and ready — the journey was worth it!',
    category: 'career',
    rarity: 'Legendary',
    xpReward: 0,
    checkUnlocked: (s) => (s?.dbBadgeIds ?? new Set()).has('placed'),
    getProgress:   (s) => ({ current: (s?.dbBadgeIds ?? new Set()).has('placed') ? 1 : 0, max: 1 }),
  },
];

/** Badge categories for the filter tabs in Achievements.jsx */
export const BADGE_CATEGORIES = [
  { id: 'all',      label: 'All Achievements' },
  { id: 'learning', label: '📚 Learning & Topics' },
  { id: 'streak',   label: '🔥 Streaks' },
  { id: 'score',    label: '🎯 Quizzes & Scores' },
  { id: 'career',   label: '💼 Career & Senior' },
];

/** Tailwind rarity style map — shared across Achievements & Profile */
export const RARITY_STYLES = {
  Common:    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  Rare:      'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Epic:      'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  Legendary: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700',
};
