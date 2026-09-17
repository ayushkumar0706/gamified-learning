const User = require('../Models/user');
const { checkSeniorEligibility } = require('../utils/seniorEligibility');

const VALID_ROLES = ['student', 'senior', 'admin'];


const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({ message: "User role updated successfully", user: targetUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const requestSeniorPromotion = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const eligibility = await checkSeniorEligibility(user);

    if (!eligibility.eligible) {
      return res.status(403).json({
        message: "You do not yet meet the criteria for senior status",
        eligibility
      });
    }

    user.role = 'senior';
    await user.save();

    res.status(200).json({ message: "Congratulations! You've been promoted to senior", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('college', 'name code city state logo')
      .select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'bio', 'careerGoal', 'currentPreparationLevel',
      'branch', 'year', 'github', 'linkedin', 'leetcode', 'codeforces',
      'profileVisibility', 'photo'
    ];

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('college', 'name code city state logo')
      .select('-password');

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateUserRole, requestSeniorPromotion, getProfile, updateProfile };