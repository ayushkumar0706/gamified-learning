
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const {createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic} = require('../controllers/topicController');


// View routes — any logged-in user
router.get('/', authMiddleware, getAllTopics);
router.get('/:id', authMiddleware, getTopicById);


// Admin-only routes
router.post('/', authMiddleware, restrictTo('admin'), createTopic);
router.patch('/:id', authMiddleware, restrictTo('admin'), updateTopic);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteTopic);



module.exports = router;