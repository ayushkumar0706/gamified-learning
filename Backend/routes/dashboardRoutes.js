const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { dashboardController } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/me', authMiddleware, dashboardController);
// Alias: /api/dashboard (without /me) — used by Profile & Achievements pages
router.get('/', authMiddleware, dashboardController);

module.exports = router;