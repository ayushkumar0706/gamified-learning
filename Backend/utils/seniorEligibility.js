const Progress = require('../Models/progress');

const MIN_Topics = 10;
const MIN_Days = 365;

const checkSeniorEligibility = async (user) => {
  const daysSinceJoining = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const tenureMet = daysSinceJoining >= MIN_Days;

  const completedCount = await Progress.countDocuments({
    user: user._id,
    status: "completed"
  });
  
  const masteryMet = completedCount >= MIN_Topics;

  return {
    eligible: tenureMet && masteryMet,
    tenureMet,
    masteryMet,
    daysSinceJoining: Math.floor(daysSinceJoining),
    completedCount
  };
};


module.exports = { checkSeniorEligibility, MIN_Topics, MIN_Days };