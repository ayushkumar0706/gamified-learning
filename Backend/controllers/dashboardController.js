const Progress = require('../Models/progress');
const Attempt = require('../Models/attempt');
const User = require('../Models/user');
const UserLevelProgress = require('../Models/userLevelProgress');
const { calculateLevel } = require('../utils/xpToLevel');
const { getISTDayDifference } = require('../utils/streak');


const dashboardController = async (req, res) => {
  try {

    const levelInfo = calculateLevel(req.user.xp);

    let displayStreak = req.user.currentStreak;
    if (req.user.lastActivityDate) {
    const daysSinceActivity = getISTDayDifference(req.user.lastActivityDate, new Date());
    if (daysSinceActivity > 1) {
        displayStreak = 0;
    }
    }

    const progressDocs = await Progress.find({ user: req.user._id });
    const progressSummary = {
      totalTopics: progressDocs.length,
      completedTopics: progressDocs.filter(p => p.status === "completed").length,
      inProgressTopics: progressDocs.filter(p => p.status === "in-progress").length
    };

    const recentAttemptsRaw = await Attempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'quiz',
        select: 'topic',
        populate: {
          path: 'topic',
          select: 'title'
        }
      });

    const recentAttempts = recentAttemptsRaw.map((attempt) => ({
      topicTitle: attempt.quiz?.topic?.title ?? "Unknown Topic",
      scorePercentage: attempt.scorePercentage,
      completedAt: attempt.createdAt
    }));

    // Cleared career levels (for Journey mini-map active index)
    const clearedLevelDocs = await UserLevelProgress.find({ user: req.user._id })
      .select('level')
      .sort({ createdAt: 1 });
    const clearedLevelIds = clearedLevelDocs.map(d => d.level.toString());

    // College rank (XP-based within same college)
    let collegeRank = null;
    if (req.user.college) {
      const higherCount = await User.countDocuments({
        college: req.user.college,
        xp: { $gt: req.user.xp },
        profileVisibility: { $in: ['public', 'college-only'] }
      });
      collegeRank = higherCount + 1;
    }

    res.status(200).json({
      dashboard: {
        xp: req.user.xp,
        level: levelInfo.level,
        xpToNextLevel: levelInfo.xpNeededForNextLevel,
        streak: displayStreak,
        maxStreak: req.user.maxStreak,
        progressSummary,
        recentAttempts,
        clearedLevelIds,
        collegeRank
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { dashboardController };