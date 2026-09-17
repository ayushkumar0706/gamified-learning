const User = require('../Models/user');
const { calculateLevel } = require('../utils/xpToLevel');
const { getISTDayDifference } = require('../utils/streak');

/**
 * GET /api/leaderboard
 * Returns college-scoped leaderboard sorted by XP.
 *
 * Query params:
 *   filter  = "overall" | "streak" (default: "overall")
 *   period  = "all-time" | "weekly" | "monthly" (default: "all-time")
 *   limit   = number (default: 50)
 */
const getLeaderboard = async (req, res) => {
  try {
    const { filter = 'overall', limit = 50 } = req.query;

    // Must be logged in (authMiddleware already ran)
    const currentUser = req.user;

    if (!currentUser.college) {
      return res.status(400).json({
        message: 'You must join a college to view the leaderboard.'
      });
    }

    // Sort field based on filter
    const sortField = filter === 'streak' ? { currentStreak: -1 } : { xp: -1 };

    // Fetch top N users in the same college
    const users = await User.find({
      college: currentUser.college,
      profileVisibility: { $in: ['public', 'college-only'] }
    })
      .select('firstName lastName photo xp level currentStreak college branch year')
      .sort(sortField)
      .limit(Number(limit));

    // Build leaderboard rows with rank
    const leaderboard = users.map((u, index) => {
      const levelInfo = calculateLevel(u.xp);
      const isCurrentUser = u._id.toString() === currentUser._id.toString();

      // Check if streak is still active
      let activeStreak = u.currentStreak;
      if (u.lastActivityDate) {
        const daysSince = getISTDayDifference(u.lastActivityDate, new Date());
        if (daysSince > 1) activeStreak = 0;
      }

      return {
        rank: index + 1,
        userId: u._id,
        name: `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`,
        photo: u.photo,
        xp: u.xp,
        platformLevel: levelInfo.level,
        streak: activeStreak,
        branch: u.branch,
        year: u.year,
        isCurrentUser
      };
    });

    // If current user is not in top list, append their entry with actual rank
    const currentUserInList = leaderboard.find((r) => r.isCurrentUser);
    let currentUserEntry = null;

    if (!currentUserInList) {
      const totalAbove = await User.countDocuments({
        college: currentUser.college,
        xp: { $gt: currentUser.xp },
        profileVisibility: { $in: ['public', 'college-only'] }
      });

      const levelInfo = calculateLevel(currentUser.xp);
      let activeStreak = currentUser.currentStreak;
      if (currentUser.lastActivityDate) {
        const daysSince = getISTDayDifference(currentUser.lastActivityDate, new Date());
        if (daysSince > 1) activeStreak = 0;
      }

      currentUserEntry = {
        rank: totalAbove + 1,
        userId: currentUser._id,
        name: `${currentUser.firstName}${currentUser.lastName ? ' ' + currentUser.lastName : ''}`,
        photo: currentUser.photo,
        xp: currentUser.xp,
        platformLevel: levelInfo.level,
        streak: activeStreak,
        branch: currentUser.branch,
        year: currentUser.year,
        isCurrentUser: true
      };
    }

    res.status(200).json({
      leaderboard,
      currentUserEntry,
      filter
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
