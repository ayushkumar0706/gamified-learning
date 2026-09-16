const VideoResource = require('../Models/videoResource');
const Topic = require('../Models/topic');
const { isPrivilegedRole } = require('../utils/permissions');


const createVideoResource = async (req, res) => {
  try {
    const { topic, title, url, styleTag, difficulty } = req.body;

    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const newVideo = await VideoResource.create({
      topic,
      title,
      url,
      styleTag,
      difficulty,
      submittedBy: req.user._id
    });

    res.status(201).json({ video: newVideo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllVideoResources = async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = { status: 'active' };
    if (topic) filter.topic = topic;

    const videos = await VideoResource.find(filter)
      .populate('topic', 'title')
      .populate('submittedBy', 'firstName');

    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getVideoResourceById = async (req, res) => {
  try {
    const video = await VideoResource.findById(req.params.id)
      .populate('topic', 'title')
      .populate('submittedBy', 'firstName');

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const upvoteVideoResource = async (req, res) => {
  try {
    const updatedVideo = await VideoResource.findOneAndUpdate(
      {
        _id: req.params.id,
        upvotedBy: { $ne: req.user._id }
      },
      {
        $addToSet: { upvotedBy: req.user._id },
        $inc: { upvotes: 1 }
      },
      { returnDocument: 'after' }
    );

    if (!updatedVideo) {
      const videoExists = await VideoResource.findById(req.params.id);
      if (!videoExists) {
        return res.status(404).json({ message: "Video not found" });
      }
      return res.status(400).json({ message: "You already upvoted this video" });
    }

    res.status(200).json({ video: updatedVideo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateVideoResource = async (req, res) => {
  try {
    const video = await VideoResource.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const isOwner = video.submittedBy.toString() === req.user._id.toString();
    const isPrivileged = isPrivilegedRole(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "You don't have permission to edit this video" });
    }

    const allowedUpdates = ['title', 'url', 'styleTag', 'difficulty'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        video[field] = req.body[field];
      }
    });

    const updatedVideo = await video.save();
    res.status(200).json({ video: updatedVideo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteVideoResource = async (req, res) => {
  try {
    const video = await VideoResource.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const isOwner = video.submittedBy.toString() === req.user._id.toString();
    const isPrivileged = isPrivilegedRole(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "You don't have permission to delete this video" });
    }

    await VideoResource.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createVideoResource,
  getAllVideoResources,
  getVideoResourceById,
  upvoteVideoResource,
  updateVideoResource,
  deleteVideoResource
};