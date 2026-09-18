const express = require('express');
const { getSeniors } = require('../controllers/seniorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get seniors for the current user's college
router.get('/', authMiddleware, getSeniors);

module.exports = router;
