const express = require('express');

const { register, login, logout, changePassword } = require('../controllers/authController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../validators/authValidators');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/logout', authMiddleware, logout);
router.put('/change-password', authMiddleware, changePassword);
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Populate college so the frontend can display college name without an extra call
    const user = await req.user.populate('college', 'name city');
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;