const express = require('express');
const { updateUserRole, requestSeniorPromotion, getProfile, updateProfile, getPublicProfile, logPlacementOffer } = require('../controllers/userController');
const { syncBadges } = require('../controllers/badgeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { optionalAuth } = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.get('/profile/:id', optionalAuth, getPublicProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/request-senior', authMiddleware, requestSeniorPromotion);
router.post('/update-role', authMiddleware, restrictTo('admin'), updateUserRole);
router.post('/badges/sync', authMiddleware, syncBadges);
router.post('/placement', authMiddleware, logPlacementOffer);

module.exports = router;