
const express = require('express');
const router = express.Router();


const authMiddleware = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/roleMiddleware');

const { createLevel, getAllLevels, getLevelById, updateLevel, deleteLevel } = require('../controllers/levelController');



router.get('/', authMiddleware, getAllLevels);
router.get('/:id', authMiddleware, getLevelById);


router.post('/', authMiddleware, restrictTo('admin'), createLevel);
router.patch('/:id', authMiddleware, restrictTo('admin'), updateLevel);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteLevel);

module.exports = router;