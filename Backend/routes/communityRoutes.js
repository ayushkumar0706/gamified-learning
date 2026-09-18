const express = require('express');
const { getPosts, createPost, createReply, upvotePost } = require('../controllers/communityController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getPosts);
router.post('/', authMiddleware, createPost);
router.post('/:id/reply', authMiddleware, createReply);
router.post('/:id/upvote', authMiddleware, upvotePost);

module.exports = router;
