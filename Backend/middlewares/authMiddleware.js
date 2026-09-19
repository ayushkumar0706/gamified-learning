const jwt = require('jsonwebtoken');
const User = require('../Models/user');


const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token doesn't exist");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid token payload");
    }

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User doesn't exist");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload._id) {
        req.user = await User.findById(payload._id);
      }
    }
  } catch (err) {
    // ignore
  }
  next();
};

module.exports = authMiddleware;
module.exports.optionalAuth = optionalAuthMiddleware;