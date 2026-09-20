const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');
const { getAdminStats, getAllResources, updateResourceStatus } = require('../controllers/adminController');
const { getAllQuizzes, getQuizQuestions, updateQuizStatus, deleteQuiz, addQuestion, updateQuestion, deleteQuestion } = require('../controllers/adminQuizController');

router.get('/stats', authMiddleware, restrictTo('admin'), getAdminStats);
router.get('/resources', authMiddleware, restrictTo('admin'), getAllResources);
router.patch('/resources/:type/:id/status', authMiddleware, restrictTo('admin'), updateResourceStatus);

// Quizzes
router.get('/quizzes', authMiddleware, restrictTo('admin'), getAllQuizzes);
router.get('/quizzes/:id/questions', authMiddleware, restrictTo('admin'), getQuizQuestions);
router.patch('/quizzes/:id/status', authMiddleware, restrictTo('admin'), updateQuizStatus);
router.delete('/quizzes/:id', authMiddleware, restrictTo('admin'), deleteQuiz);

// Quiz Questions
router.post('/quizzes/:quizId/questions', authMiddleware, restrictTo('admin'), addQuestion);
router.put('/questions/:questionId', authMiddleware, restrictTo('admin'), updateQuestion);
router.delete('/questions/:questionId', authMiddleware, restrictTo('admin'), deleteQuestion);

module.exports = router;
