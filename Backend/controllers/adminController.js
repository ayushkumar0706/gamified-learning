const User = require('../Models/user');
const College = require('../Models/college');
const Level = require('../Models/level');
const Topic = require('../Models/topic');
const VideoResource = require('../Models/videoResource');
const CodingResource = require('../Models/codingResources');
const Job = require('../Models/job');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalSeniors = await User.countDocuments({ role: 'senior' });
    const totalColleges = await College.countDocuments();
    const totalLevels = await Level.countDocuments();
    const totalTopics = await Topic.countDocuments();
    const totalResources = await VideoResource.countDocuments();
    const totalJobs = await Job.countDocuments();

    // specific status counts
    const pendingModeration = await VideoResource.countDocuments({ status: 'flagged' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSeniors,
        totalColleges,
        totalLevels,
        totalTopics,
        totalResources,
        totalJobs,
        pendingModeration
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllResources = async (req, res) => {
  try {
    const videos = await VideoResource.find()
      .populate('topic', 'title')
      .populate('submittedBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    const coding = await CodingResource.find()
      .populate('topic', 'title')
      .populate('submittedBy', 'firstName lastName role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        videos,
        coding
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateResourceStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    let updatedResource;
    if (type === 'video') {
      updatedResource = await VideoResource.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } else if (type === 'coding') {
      updatedResource = await CodingResource.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ success: true, data: updatedResource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAdminStats, getAllResources, updateResourceStatus };
