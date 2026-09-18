const Post = require('../Models/post');

exports.getPosts = async (req, res) => {
  try {
    const { college } = req.user;
    
    // Fetch posts scoped to user's college
    const posts = await Post.find({ college })
      .populate('author', 'firstName lastName role branch year seniorProfile')
      .populate('replies.author', 'firstName lastName role branch year seniorProfile')
      .sort({ createdAt: -1 })
      .lean();
      
    // Format for frontend
    const formattedPosts = posts.map(post => {
      // helper to format author
      const formatAuthor = (user) => {
        if (!user) return { name: 'Unknown User', role: 'student' };
        return {
          id: user._id,
          name: `${user.firstName} ${user.lastName || ''}`.trim(),
          role: user.role,
          company: user.seniorProfile?.company,
          branch: user.branch,
          year: user.year ? `Year ${user.year}` : 'Senior'
        };
      };

      // format replies
      const replies = (post.replies || []).map(rep => ({
        id: rep._id,
        author: formatAuthor(rep.author),
        content: rep.content,
        createdAt: rep.createdAt
      }));

      return {
        id: post._id,
        author: formatAuthor(post.author),
        channel: post.channel,
        title: post.title,
        content: post.content,
        tags: post.tags,
        upvotes: post.upvotes.length,
        upvoted: post.upvotes.some(id => id.toString() === req.user._id.toString()),
        createdAt: post.createdAt,
        replies: replies
      };
    });

    res.status(200).json({
      success: true,
      posts: formattedPosts
    });
  } catch (error) {
    console.error('Error in getPosts:', error);
    res.status(500).json({ success: false, message: 'Server error fetching posts.' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { channel, title, content, tags } = req.body;
    
    if (!title || !content || !channel) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const post = await Post.create({
      author: req.user._id,
      college: req.user.college,
      channel,
      title,
      content,
      tags: tags || []
    });

    // Populate so we can return formatted new post
    await post.populate('author', 'firstName lastName role branch year seniorProfile');

    res.status(201).json({
      success: true,
      post: post
    });
  } catch (error) {
    console.error('Error in createPost:', error);
    res.status(500).json({ success: false, message: 'Server error creating post.' });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content required' });
    }

    const post = await Post.findOneAndUpdate(
      { _id: id, college: req.user.college },
      { $push: { replies: { author: req.user._id, content } } },
      { new: true }
    )
    .populate('replies.author', 'firstName lastName role branch year seniorProfile')
    .lean();

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(201).json({
      success: true,
      replies: post.replies
    });
  } catch (error) {
    console.error('Error in createReply:', error);
    res.status(500).json({ success: false, message: 'Server error adding reply.' });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findOne({ _id: id, college: req.user.college });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const hasUpvoted = post.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      post.upvotes.pull(userId);
    } else {
      // Add upvote
      post.upvotes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      upvotes: post.upvotes.length,
      upvoted: !hasUpvoted
    });
  } catch (error) {
    console.error('Error in upvotePost:', error);
    res.status(500).json({ success: false, message: 'Server error upvoting.' });
  }
};
