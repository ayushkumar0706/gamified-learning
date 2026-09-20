const Conversation = require('../Models/conversation');
const Message = require('../Models/message');
const User = require('../Models/user');

// Get all conversations for the authenticated user
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'firstName lastName photo')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between current user and target user
const getMessagesWithUser = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;

    // Check if conversation exists
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, targetUserId] }
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    // Mark messages sent by the target user as read
    await Message.updateMany(
      { conversationId: conversation._id, sender: targetUserId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user._id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    // Verify target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, targetUserId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [currentUserId, targetUserId]
      });
      await conversation.save();
    }

    // Create the message
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: currentUserId,
      receiver: targetUserId,
      content: content.trim()
    });
    await newMessage.save();

    // Update the conversation's last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const unreadCount = await Message.countDocuments({
      receiver: currentUserId,
      isRead: false
    });
    res.status(200).json({ unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessagesWithUser,
  sendMessage,
  getUnreadCount
};
