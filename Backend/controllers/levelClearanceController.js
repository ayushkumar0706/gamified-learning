const Level = require('../Models/level');
const Topic = require('../Models/topic');
const Progress = require('../Models/progress');
const UserLevelProgress = require('../Models/userLevelProgress');
const User = require('../Models/user');
const XPLog = require('../Models/xpLog');
const { calculateLevel } = require('../utils/xpToLevel');

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether the user has met a single clearance criterion for a level.
 *
 * @param {Object} criterion   - Level.clearanceCriteria entry
 * @param {Array}  topicIds    - ObjectIds of all topics in the level
 * @param {Array}  progressDocs - Progress docs for this user + these topics
 * @returns {{ met: Boolean, current: Number, target: Number }}
 */
function checkCriterion(criterion, topicIds, progressDocs) {
  const target = criterion.targetCount ?? 1;

  switch (criterion.type) {
    case 'topic-completion': {
      const completed = progressDocs.filter(p => p.status === 'completed').length;
      return { met: completed >= target, current: completed, target };
    }

    case 'quiz-pass': {
      // A topic "quiz-passed" means its best score is >= 70%
      const passed = progressDocs.filter(p => p.bestScorePercentage >= 70).length;
      return { met: passed >= target, current: passed, target };
    }

    case 'problem-count': {
      // We don't track individual problem attempts yet.
      // Treat as automatically met so it doesn't block progress.
      return { met: true, current: target, target };
    }

    case 'challenge':
    case 'project':
    case 'manual': {
      // Manual / future criteria — treat as automatically met for now
      return { met: true, current: target, target };
    }

    default:
      return { met: true, current: target, target };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/levels/my-progress
// Returns which levels the current user has cleared.
// ─────────────────────────────────────────────────────────────────────────────
const getMyLevelProgress = async (req, res) => {
  try {
    const cleared = await UserLevelProgress.find({ user: req.user._id })
      .select('level clearedAt xpAwarded badgeAwarded')
      .sort({ clearedAt: 1 });

    res.status(200).json({ clearedLevels: cleared });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/levels/:id/clear
// Verifies clearance criteria and, if all met, clears the level for the user.
// ─────────────────────────────────────────────────────────────────────────────
const clearLevel = async (req, res) => {
  try {
    const levelId = req.params.id;
    const userId  = req.user._id;

    // ── 1. Load the level ────────────────────────────────────────────────────
    const level = await Level.findById(levelId);
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }

    // ── 2. Already cleared? ──────────────────────────────────────────────────
    const alreadyCleared = await UserLevelProgress.findOne({ user: userId, level: levelId });
    if (alreadyCleared) {
      return res.status(400).json({ message: 'You have already cleared this level!' });
    }

    // ── 3. Check prerequisite level is cleared ───────────────────────────────
    if (level.prerequisiteLevel) {
      const prereqCleared = await UserLevelProgress.findOne({
        user: userId,
        level: level.prerequisiteLevel
      });
      if (!prereqCleared) {
        return res.status(403).json({
          message: 'Complete the previous level before clearing this one.'
        });
      }
    }

    // ── 4. Load topics in this level ─────────────────────────────────────────
    const topics = await Topic.find({ level: levelId }).select('_id');
    const topicIds = topics.map(t => t._id);

    // ── 5. Load user progress for those topics ───────────────────────────────
    const progressDocs = topicIds.length > 0
      ? await Progress.find({ user: userId, topic: { $in: topicIds } })
      : [];

    // ── 6. Evaluate each clearance criterion ─────────────────────────────────
    const criteriaResults = (level.clearanceCriteria ?? []).map(criterion => ({
      criteriaId: criterion.criteriaId,
      label:      criterion.label,
      ...checkCriterion(criterion, topicIds, progressDocs)
    }));

    const allMet = criteriaResults.every(c => c.met);

    if (!allMet) {
      return res.status(422).json({
        message: 'Not all clearance criteria have been met yet.',
        criteriaResults
      });
    }

    // ── 7. Mark level as cleared ─────────────────────────────────────────────
    const badge = level.badgeUnlocked?.badgeId ? level.badgeUnlocked : null;

    const levelProgress = await UserLevelProgress.create({
      user:       userId,
      level:      levelId,
      xpAwarded:  level.xpReward ?? 0,
      badgeAwarded: badge ?? undefined
    });

    // ── 8. Award XP and badge to user ────────────────────────────────────────
    const user = await User.findById(userId);
    const reward = level.xpReward ?? 0;
    user.xp += reward;

    if (reward > 0 && user.college) {
      await XPLog.create({
        user: user._id,
        college: user.college,
        amount: reward,
        source: 'level-clear'
      });
    }

    const levelInfo = calculateLevel(user.xp);
    user.level = levelInfo.level;

    if (badge) {
      // Avoid duplicates
      const alreadyHasBadge = user.badges.some(b => b.badgeId === badge.badgeId);
      if (!alreadyHasBadge) {
        user.badges.push({
          badgeId:     badge.badgeId,
          name:        badge.name,
          icon:        badge.icon,
          description: badge.description,
          earnedAt:    new Date()
        });
      }
    }

    await user.save();

    // ── 9. Respond ───────────────────────────────────────────────────────────
    res.status(200).json({
      message: `🎉 ${level.name} cleared!`,
      levelProgress,
      xpAwarded:  level.xpReward ?? 0,
      badgeAwarded: badge,
      newXp:      user.xp,
      newPlatformLevel: levelInfo.level,
      criteriaResults
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { clearLevel, getMyLevelProgress };
