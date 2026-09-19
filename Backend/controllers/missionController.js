const MissionClaim = require('../Models/missionClaim');
const XPLog = require('../Models/xpLog');
const User = require('../Models/user');
const { calculateLevel } = require('../utils/xpToLevel');

// Define the static daily missions
const MISSIONS = {
  'daily-learner': {
    id: 'daily-learner',
    title: 'Daily Learner',
    description: 'Earn 150 XP today.',
    target: 150,
    reward: 30
  },
  'quiz-master': {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 2 Quizzes today.',
    target: 2,
    reward: 50
  },
  'level-up': {
    id: 'level-up',
    title: 'Level Up',
    description: 'Clear 1 Level today.',
    target: 1,
    reward: 100
  }
};

// Helper: Get today's start and end date (UTC)
const getTodayRange = () => {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

// Helper: get YYYY-MM-DD string for today (UTC)
const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

const getDailyMissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { start, end } = getTodayRange();
    const todayStr = getTodayString();

    // 1. Fetch today's activity from XPLog
    const todayLogs = await XPLog.find({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    let totalXpToday = 0;
    let quizzesToday = 0;
    let levelsClearedToday = 0;

    todayLogs.forEach(log => {
      // Don't count mission-rewards towards "Earn 50 XP" to avoid recursive easy clears
      if (log.source !== 'mission-reward') {
        totalXpToday += log.amount;
      }
      if (log.source === 'quiz') {
        quizzesToday += 1;
      }
      if (log.source === 'level-clear') {
        levelsClearedToday += 1;
      }
    });

    // 2. Fetch today's claims
    const claims = await MissionClaim.find({
      user: userId,
      dateStr: todayStr
    });
    const claimedMissionIds = claims.map(c => c.missionId);

    // 3. Construct the response
    const missionsStatus = Object.values(MISSIONS).map(mission => {
      let currentProgress = 0;
      if (mission.id === 'daily-learner') currentProgress = totalXpToday;
      if (mission.id === 'quiz-master') currentProgress = quizzesToday;
      if (mission.id === 'level-up') currentProgress = levelsClearedToday;

      return {
        ...mission,
        currentProgress: Math.min(currentProgress, mission.target),
        isCompleted: currentProgress >= mission.target,
        isClaimed: claimedMissionIds.includes(mission.id)
      };
    });

    res.status(200).json(missionsStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const claimMissionReward = async (req, res) => {
  try {
    const userId = req.user._id;
    const { missionId } = req.params;
    const todayStr = getTodayString();
    const { start, end } = getTodayRange();

    const missionDef = MISSIONS[missionId];
    if (!missionDef) {
      return res.status(404).json({ message: 'Mission not found.' });
    }

    // 1. Ensure not already claimed today
    const existingClaim = await MissionClaim.findOne({
      user: userId,
      missionId,
      dateStr: todayStr
    });
    if (existingClaim) {
      return res.status(400).json({ message: 'Reward already claimed today.' });
    }

    // 2. Verify completion
    const todayLogs = await XPLog.find({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    let currentProgress = 0;
    todayLogs.forEach(log => {
      if (missionId === 'daily-learner' && log.source !== 'mission-reward') currentProgress += log.amount;
      if (missionId === 'quiz-master' && log.source === 'quiz') currentProgress += 1;
      if (missionId === 'level-up' && log.source === 'level-clear') currentProgress += 1;
    });

    if (currentProgress < missionDef.target) {
      return res.status(400).json({ message: 'Mission not yet completed.' });
    }

    // 3. Mark as claimed
    await MissionClaim.create({
      user: userId,
      missionId,
      dateStr: todayStr
    });

    // 4. Award XP
    const user = await User.findById(userId);
    user.xp += missionDef.reward;
    const levelInfo = calculateLevel(user.xp);
    user.level = levelInfo.level;
    await user.save();

    // 5. Log the reward XP
    if (user.college) {
      await XPLog.create({
        user: userId,
        college: user.college,
        amount: missionDef.reward,
        source: 'mission-reward'
      });
    }

    res.status(200).json({
      message: `Reward claimed! +${missionDef.reward} XP`,
      reward: missionDef.reward,
      newXp: user.xp,
      newLevel: user.level
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyMissions, claimMissionReward };
