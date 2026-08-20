const Progress = require('../Models/progress');

const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate('topic', 'title order prerequisiteTopic');

    res.status(200).json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getMyProgress };