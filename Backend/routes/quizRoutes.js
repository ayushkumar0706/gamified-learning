const express = require('express');
const router = express.Router();
const { createQuiz, getQuizForTaking, getQuizzesByTopic } = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, restrictTo('senior', 'admin'), createQuiz);
router.get('/:id/take', authMiddleware, getQuizForTaking);
router.get('/', authMiddleware, getQuizzesByTopic);

module.exports = router;