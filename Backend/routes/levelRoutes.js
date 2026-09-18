
const express = require('express');
const router = express.Router();


const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const { createLevel, getAllLevels, getLevelById, updateLevel, deleteLevel } = require('../controllers/levelController');
const { clearLevel, getMyLevelProgress } = require('../controllers/levelClearanceController');



// ── Student routes ─────────────────────────────────────────────────────────
router.get('/', authMiddleware, getAllLevels);
// NOTE: /my-progress must be registered BEFORE /:id to avoid Express matching
// "my-progress" as an id parameter.
router.get('/my-progress', authMiddleware, getMyLevelProgress);
router.get('/:id', authMiddleware, getLevelById);

// ── Level clearance ────────────────────────────────────────────────────────
router.post('/:id/clear', authMiddleware, clearLevel);

// ── Admin routes ───────────────────────────────────────────────────────────
router.post('/', authMiddleware, restrictTo('admin'), createLevel);
router.patch('/:id', authMiddleware, restrictTo('admin'), updateLevel);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteLevel);

module.exports = router;