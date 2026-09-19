const Progress = require('../Models/progress');

const MIN_Topics = 15;
const MIN_Days = 0; // Removed 365 day requirement so new users can become seniors after completing topics

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