const CodingResource = require('../Models/codingResources');
const Topic = require('../Models/topic');
const { isPrivilegedRole } = require('../utils/permissions');


const createCodingResource = async (req, res) => {
  try {
    const { topic, title, url, platform, difficulty } = req.body;

    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const newResource = await CodingResource.create({
      topic,
      title,
      url,
      platform,
      difficulty,
      submittedBy: req.user._id
    });

    res.status(201).json({ resource: newResource });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllCodingResources = async (req, res) => {
  try {
    const { topic, platform, difficulty } = req.query;

    const filter = { status: 'active' };
    if (topic) filter.topic = topic;
    if (platform) filter.platform = platform;
    if (difficulty) filter.difficulty = difficulty;

    const resources = await CodingResource.find(filter)
      .populate('topic', 'title')
      .populate('submittedBy', 'name');

    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCodingResourceById = async (req, res) => {
  try {
    const resource = await CodingResource.findById(req.params.id)
      .populate('topic', 'title')
      .populate('submittedBy', 'name');

    if (!resource) {
      return res.status(404).json({ message: "Coding resource not found" });
    }

    res.status(200).json({ resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCodingResource = async (req, res) => {
  try {
    const resource = await CodingResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Coding resource not found" });
    }

    const isOwner = resource.submittedBy.toString() === req.user._id.toString();
    const isPrivileged = isPrivilegedRole(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "You don't have permission to edit this resource" });
    }

    const allowedUpdates = ['title', 'url', 'platform', 'difficulty', 'status'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        resource[field] = req.body[field];
      }
    });

    const updatedResource = await resource.save();
    res.status(200).json({ resource: updatedResource });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteCodingResource = async (req, res) => {
  try {
    const resource = await CodingResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Coding resource not found" });
    }

    const isOwner = resource.submittedBy.toString() === req.user._id.toString();
    const isPrivileged = isPrivilegedRole(req.user.role);

    if (!isOwner && !isPrivileged) {
      return res.status(403).json({ message: "You don't have permission to delete this resource" });
    }

    await CodingResource.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Coding resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createCodingResource,
  getAllCodingResources,
  getCodingResourceById,
  updateCodingResource,
  deleteCodingResource
};