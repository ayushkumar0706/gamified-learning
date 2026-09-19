const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getLeaderboard, getPublicLeaderboard } = require('../controllers/leaderboardController');

// GET /api/leaderboard/public?limit=5
router.get('/public', getPublicLeaderboard);

// GET /api/leaderboard?filter=overall&limit=50
router.get('/', authMiddleware, getLeaderboard);

module.exports = router;
