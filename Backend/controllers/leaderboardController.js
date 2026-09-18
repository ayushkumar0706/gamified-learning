const User = require('../Models/user');
const XPLog = require('../Models/xpLog');
const { calculateLevel } = require('../utils/xpToLevel');
const { getISTDayDifference } = require('../utils/streak');
const mongoose = require('mongoose');

const getLeaderboard = async (req, res) => {
  try {
    const { filter = 'overall', period = 'all-time', limit = 50 } = req.query;
    const currentUser = req.user;

    if (!currentUser.college) {
      return res.status(400).json({ message: 'You must join a college to view the leaderboard.' });
    }

    let leaderboard = [];
    let currentUserEntry = null;

    if (filter === 'streak' || period === 'all-time') {
      // Use existing User model logic
      const sortField = filter === 'streak' ? { currentStreak: -1 } : { xp: -1 };
      
      const users = await User.find({
        college: currentUser.college,
        profileVisibility: { $in: ['public', 'college-only'] }
      })
        .select('firstName lastName photo xp level currentStreak lastActivityDate college branch year')
        .sort(sortField)
        .limit(Number(limit))
        .lean();

      leaderboard = users.map((u, index) => {
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
          platformLevel: calculateLevel(u.xp).level,
          streak: activeStreak,
          branch: u.branch,
          year: u.year,
          isCurrentUser: u._id.toString() === currentUser._id.toString()
        };
      });

      const currentUserInList = leaderboard.find(r => r.isCurrentUser);
      if (!currentUserInList) {
        const query = filter === 'streak' ? { currentStreak: { $gt: currentUser.currentStreak } } : { xp: { $gt: currentUser.xp } };
        const totalAbove = await User.countDocuments({
          college: currentUser.college,
          ...query,
          profileVisibility: { $in: ['public', 'college-only'] }
        });

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
          platformLevel: calculateLevel(currentUser.xp).level,
          streak: activeStreak,
          branch: currentUser.branch,
          year: currentUser.year,
          isCurrentUser: true
        };
      }
    } else {
      // Period is weekly or monthly, and filter is overall (XP)
      const now = new Date();
      let startDate = new Date();
      if (period === 'weekly') {
        startDate.setDate(now.getDate() - 7);
      } else if (period === 'monthly') {
        startDate.setMonth(now.getMonth() - 1);
      }
      
      const aggregateResult = await XPLog.aggregate([
        {
          $match: {
            college: new mongoose.Types.ObjectId(currentUser.college),
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$user',
            periodXp: { $sum: '$amount' }
          }
        },
        { $sort: { periodXp: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $match: {
            'userInfo.profileVisibility': { $in: ['public', 'college-only'] }
          }
        }
      ]);

      leaderboard = aggregateResult.slice(0, Number(limit)).map((item, index) => {
        const u = item.userInfo;
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
          xp: item.periodXp, // Show period XP, not all-time XP
          platformLevel: calculateLevel(u.xp).level, // But keep actual level
          streak: activeStreak,
          branch: u.branch,
          year: u.year,
          isCurrentUser: u._id.toString() === currentUser._id.toString()
        };
      });

      const currentUserInList = leaderboard.find(r => r.isCurrentUser);
      if (!currentUserInList) {
        // Find current user's period XP
        const currentUserAgg = aggregateResult.find(item => item._id.toString() === currentUser._id.toString());
        if (currentUserAgg) {
          const rank = aggregateResult.findIndex(item => item._id.toString() === currentUser._id.toString()) + 1;
          const u = currentUserAgg.userInfo;
          let activeStreak = u.currentStreak;
          if (u.lastActivityDate) {
            const daysSince = getISTDayDifference(u.lastActivityDate, new Date());
            if (daysSince > 1) activeStreak = 0;
          }
          currentUserEntry = {
            rank: rank,
            userId: u._id,
            name: `${u.firstName}${u.lastName ? ' ' + u.lastName : ''}`,
            photo: u.photo,
            xp: currentUserAgg.periodXp,
            platformLevel: calculateLevel(u.xp).level,
            streak: activeStreak,
            branch: u.branch,
            year: u.year,
            isCurrentUser: true
          };
        } else {
          // 0 XP in this period
          let activeStreak = currentUser.currentStreak;
          if (currentUser.lastActivityDate) {
            const daysSince = getISTDayDifference(currentUser.lastActivityDate, new Date());
            if (daysSince > 1) activeStreak = 0;
          }
          currentUserEntry = {
            rank: aggregateResult.length + 1,
            userId: currentUser._id,
            name: `${currentUser.firstName}${currentUser.lastName ? ' ' + currentUser.lastName : ''}`,
            photo: currentUser.photo,
            xp: 0,
            platformLevel: calculateLevel(currentUser.xp).level,
            streak: activeStreak,
            branch: currentUser.branch,
            year: currentUser.year,
            isCurrentUser: true
          };
        }
      }
    }

    res.status(200).json({ leaderboard, currentUserEntry, filter, period });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };
