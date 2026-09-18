const express = require('express');
const { getDailyMissions, claimMissionReward } = require('../controllers/missionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getDailyMissions);
router.post('/:missionId/claim', authMiddleware, claimMissionReward);

module.exports = router;
