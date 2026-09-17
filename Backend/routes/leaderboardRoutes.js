const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getLeaderboard } = require('../controllers/leaderboardController');

// GET /api/leaderboard?filter=overall&limit=50
router.get('/', authMiddleware, getLeaderboard);

module.exports = router;
