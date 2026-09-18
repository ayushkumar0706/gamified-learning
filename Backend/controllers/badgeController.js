const User = require('../Models/user');
const Progress = require('../Models/progress');
const Attempt = require('../Models/attempt');
const XPLog = require('../Models/xpLog');
const BADGE_DEFINITIONS = require('../config/badges');
const { calculateLevel } = require('../utils/xpToLevel');

const syncBadges = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Gather live stats
    const completedTopics = await Progress.countDocuments({
      user: userId,
      status: 'completed'
    });

    const recentAttempts = await Attempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const stats = {
      completedTopics,
      recentAttempts,
      xp: user.xp,
      level: user.level,
      streak: user.currentStreak || 0,
      maxStreak: user.maxStreak || 0,
      role: user.role
    };

    // 2. Identify which badges the user already has
    const existingBadgeIds = new Set((user.badges || []).map(b => b.badgeId));
    const newlyAwarded = [];

    // 3. Evaluate criteria
    for (const badgeDef of BADGE_DEFINITIONS) {
      if (!existingBadgeIds.has(badgeDef.id) && badgeDef.checkUnlocked(stats)) {
        // Award badge
        user.badges.push({
          badgeId: badgeDef.id,
          name: badgeDef.name,
          icon: badgeDef.icon,
          description: badgeDef.description,
          earnedAt: new Date()
        });

        // Award XP
        user.xp += badgeDef.xpReward;
        
        // Log XP
        if (user.college) {
          await XPLog.create({
            user: userId,
            college: user.college,
            amount: badgeDef.xpReward,
            source: 'badge-reward'
          });
        }

        newlyAwarded.push({ ...badgeDef, xpReward: badgeDef.xpReward });
      }
    }

    // 4. Save updates if any badges were awarded
    if (newlyAwarded.length > 0) {
      const levelInfo = calculateLevel(user.xp);
      user.level = levelInfo.level;
      await user.save();
    }

    res.status(200).json({
      message: 'Badge sync complete',
      newBadges: newlyAwarded,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { syncBadges };
