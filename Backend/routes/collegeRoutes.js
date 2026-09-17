const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');
const {
  searchColleges,
  getCollegeById,
  createCollege,
  updateCollege
} = require('../controllers/collegeController');

// Public search (no auth needed — used during onboarding before login)
router.get('/', searchColleges);
router.get('/:id', getCollegeById);

// Admin only
router.post('/', authMiddleware, restrictTo('admin'), createCollege);
router.patch('/:id', authMiddleware, restrictTo('admin'), updateCollege);

module.exports = router;
