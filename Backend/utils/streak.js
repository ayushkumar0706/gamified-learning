
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const getISTDateString = (date) => {
  const shifted = new Date(date.getTime() + IST_OFFSET_MS);
  return shifted.toISOString().split('T')[0]; 
};


const getISTDayDifference = (date1, date2) => {
  const day1 = getISTDateString(date1);
  const day2 = getISTDateString(date2);

  const d1 = new Date(day1 + 'T00:00:00.000Z');
  const d2 = new Date(day2 + 'T00:00:00.000Z');

  const diffMs = Math.abs(d2 - d1);
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
};

const updateUserStreak = (user) => {
  const now = new Date();
  
  if (!user.lastActivityDate) {
    user.currentStreak = 1;
  } else {
    const dayDiff = getISTDayDifference(user.lastActivityDate, now);
    if (dayDiff === 1) {
      user.currentStreak += 1;
    } else if (dayDiff > 1) {
      user.currentStreak = 1;
    }
  }

  user.lastActivityDate = now;

  if (user.currentStreak > (user.maxStreak || 0)) {
    user.maxStreak = user.currentStreak;
  }
};

module.exports = { getISTDateString, getISTDayDifference, updateUserStreak };