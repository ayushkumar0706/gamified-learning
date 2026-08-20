const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { dashboardController } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/me', authMiddleware, dashboardController);

module.exports = router;