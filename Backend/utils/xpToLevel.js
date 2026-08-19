const calculateLevel = (totalXp) => {
  let level = 1;
  let xpUsed = 0;
  let xpForNextLevel = 100 * level;

  while (xpUsed + xpForNextLevel <= totalXp) {
    xpUsed += xpForNextLevel;
    level += 1;
    xpForNextLevel = 100 * level;
  }

  const xpIntoCurrentLevel = totalXp - xpUsed;
  const xpNeededForNextLevel = xpForNextLevel;

  return {
    level,
    xpIntoCurrentLevel,
    xpNeededForNextLevel
  };
};


module.exports = { calculateLevel };