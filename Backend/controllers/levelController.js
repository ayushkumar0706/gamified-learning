const Level = require('../models/Level');


// Create a new level — Admin only
const createLevel = async (req, res) => {
  try {
    const { name, description, order } = req.body;

    const level = await Level.create({ name, description, order });

    res.status(201).json({ message: "Level created successfully", level });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Get all levels
const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort({ order: 1 });
    res.status(200).json({ levels });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get a single level by ID
const getLevelById = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    res.status(200).json({ level });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Update a level — Admin only
const updateLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true, context: 'query' }
    );

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    res.status(200).json({ message: "Level updated successfully", level });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};




// Delete a level — Admin only
const deleteLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    res.status(200).json({ message: "Level deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createLevel, getAllLevels, getLevelById, updateLevel, deleteLevel };