const Topic = require('../Models/topic');


// Create a new topic — Admin only
const createTopic = async (req, res) => {
  try {
    const { title, subject, desciription, order, level, prerequisiteTopic } = req.body;

    const topic = await Topic.create({
        level,
        title,
        subject,
        desciription,
        order,
        prerequisiteTopic
    });

    res.status(201).json({ message: "Topic created successfully", topic });
  } catch (err) {
    res.status(400).json({ message: err.message });    
  }
};


// Get all topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 }).populate('level');;
    res.status(200).json({ topics });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a single topic by ID
const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('level');;

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ topic });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update a topic — Admin only
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Topic updated successfully", topic });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// Delete a topic — Admin only
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic };