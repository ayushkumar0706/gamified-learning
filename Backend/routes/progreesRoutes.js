const express = require('express');

const { getMyProgress } = require('../controllers/progressController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getMyProgress);

module.exports = router;