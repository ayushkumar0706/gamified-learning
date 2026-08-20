const express = require('express');
const { updateUserRole, requestSeniorPromotion } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const router = express.Router();

router.post('/request-senior', authMiddleware, requestSeniorPromotion);
router.post('/update-role', authMiddleware, restrictTo('admin'), updateUserRole);

module.exports = router;