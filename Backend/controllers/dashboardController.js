const Progress = require('../Models/progress');
const Attempt  = require('../Models/attempt');
const User     = require('../Models/user');
const Level    = require('../Models/level');
const Topic    = require('../Models/topic');
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
    const completedTopicIds = new Set(
      progressDocs.filter(p => p.status === 'completed').map(p => (p.topic?._id || p.topic).toString())
    );

    const progressSummary = {
      totalTopics:     progressDocs.length,
      completedTopics: completedTopicIds.size,
      inProgressTopics: progressDocs.filter(p => p.status === 'in-progress').length
    };

    const recentAttemptsRaw = await Attempt.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'quiz',
        select: 'topic',
        populate: { path: 'topic', select: 'title' }
      });

    const recentAttempts = recentAttemptsRaw.map(attempt => ({
      topicTitle:      attempt.quiz?.topic?.title ?? 'Unknown Topic',
      scorePercentage: attempt.scorePercentage,
      completedAt:     attempt.createdAt
    }));

    // Cleared career levels
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

    // ── Recommended topics: next 3 incomplete topics from the active level ──
    let recommendedTopics = [];
    try {
      // Active level = first level not yet cleared (by order)
      const allLevels = await Level.find().sort({ order: 1 }).select('_id name order icon color');
      const activeLevel = allLevels.find(l => !clearedLevelIds.includes(l._id.toString())) || allLevels[0];

      if (activeLevel) {
        const activeTopics = await Topic.find({ level: activeLevel._id })
          .sort({ order: 1 })
          .select('_id title subject description desciription');

        recommendedTopics = activeTopics
          .filter(t => !completedTopicIds.has(t._id.toString()))
          .slice(0, 3)
          .map(t => ({
            _id:        t._id,
            title:      t.title,
            subject:    t.subject,
            description: t.description || t.desciription || null,
            levelName:  activeLevel.name,
            levelIcon:  activeLevel.icon,
            levelColor: activeLevel.color
          }));
      }
    } catch {
      // Non-fatal: if recommendations fail, dashboard still loads
      recommendedTopics = [];
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
        collegeRank,
        recommendedTopics
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { dashboardController };