const express = require('express');

const { checkAnswer, submitAttempt } = require('../controllers/attemptController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/check-answer', authMiddleware, checkAnswer);
router.post('/submit', authMiddleware, submitAttempt);


module.exports = router;