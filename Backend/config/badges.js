const BADGE_DEFINITIONS = [
  // ── Learning & Topics ──────────────────────────────────────────────────
  {
    id: 'first-step',
    name: 'First Step',
    xpReward: 50,
    icon: '🚀',
    description: 'Complete your very first topic module.',
    checkUnlocked: (stats) => stats.completedTopics >= 1
  },
  {
    id: 'dsa-initiate',
    name: 'DSA Initiate',
    xpReward: 100,
    icon: '🧠',
    description: 'Complete 3 learning topics across any level.',
    checkUnlocked: (stats) => stats.completedTopics >= 3
  },
  {
    id: 'dsa-warrior',
    name: 'DSA Warrior',
    xpReward: 250,
    icon: '⚔️',
    description: 'Complete 6 topics and build solid foundations.',
    checkUnlocked: (stats) => stats.completedTopics >= 6
  },
  {
    id: 'century-xp',
    name: 'Century Pioneer',
    xpReward: 100,
    icon: '💎',
    description: 'Accumulate 200 total XP from quizzes and milestones.',
    checkUnlocked: (stats) => stats.xp >= 200
  },
  {
    id: 'grand-master',
    name: 'Grand Master',
    xpReward: 1000,
    icon: '🏆',
    description: 'Amass 1,000+ total XP across your campus journey.',
    checkUnlocked: (stats) => stats.xp >= 1000
  },

  // ── Streaks ────────────────────────────────────────────────────────────
  {
    id: 'streak-starter',
    name: 'Spark of Habit',
    xpReward: 50,
    icon: '⚡',
    description: 'Maintain an active daily learning streak for 2 days.',
    checkUnlocked: (stats) => Math.max(stats.streak, stats.maxStreak) >= 2
  },
  {
    id: 'streak-fire',
    name: 'On Fire',
    xpReward: 150,
    icon: '🔥',
    description: 'Maintain a 5-day continuous learning streak.',
    checkUnlocked: (stats) => Math.max(stats.streak, stats.maxStreak) >= 5
  },
  {
    id: 'streak-legend',
    name: 'Habit Champion',
    xpReward: 500,
    icon: '👑',
    description: 'Reach an unbelievable 14-day study streak!',
    checkUnlocked: (stats) => Math.max(stats.streak, stats.maxStreak) >= 14
  },

  // ── Quizzes & Scores ───────────────────────────────────────────────────
  {
    id: 'quiz-ace',
    name: 'Quiz Ace',
    xpReward: 80,
    icon: '🎯',
    description: 'Score 80% or higher on any topic assessment.',
    checkUnlocked: (stats) => stats.recentAttempts?.some(a => a.scorePercentage >= 80)
  },
  {
    id: 'perfect-score',
    name: 'Flawless Victory',
    xpReward: 300,
    icon: '✨',
    description: 'Achieve a 100% perfect score on a topic quiz.',
    checkUnlocked: (stats) => stats.recentAttempts?.some(a => a.scorePercentage === 100)
  },

  // ── Career ───────────────────────────────────────────
  {
    id: 'senior-mentor',
    name: 'Campus Guide',
    xpReward: 400,
    icon: '🎓',
    description: 'Achieve Senior status to mentor juniors in your college.',
    checkUnlocked: (stats) => stats.role === 'senior' || stats.role === 'admin'
  },
  {
    id: 'placement-ready',
    name: 'Placement Ready',
    xpReward: 750,
    icon: '💼',
    description: 'Complete 10 topics and reach Platform Level 5.',
    checkUnlocked: (stats) => stats.completedTopics >= 10 && stats.level >= 5
  }
];

module.exports = BADGE_DEFINITIONS;
