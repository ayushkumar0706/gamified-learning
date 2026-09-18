const express = require('express');

const { register, login, logout, changePassword } = require('../controllers/authController');
const { registerValidation, loginValidation, handleValidationErrors } = require('../validators/authValidators');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);
router.post('/logout', authMiddleware, logout);
router.put('/change-password', authMiddleware, changePassword);
router.get('/me', authMiddleware, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;