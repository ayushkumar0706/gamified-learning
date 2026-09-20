const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');

router.use(authMiddleware);

// Get all conversations
router.get('/', getConversations);

// Get total unread count across all conversations
router.get('/unread-count', getUnreadCount);

// Get messages with a specific user
router.get('/:userId', getMessagesWithUser);

// Send message to a specific user
router.post('/:userId', sendMessage);

module.exports = router;
