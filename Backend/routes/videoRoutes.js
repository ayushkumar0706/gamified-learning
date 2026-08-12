const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/roleMiddleware');

const { createVideoResource, getAllVideoResources, getVideoResourceById,  upvoteVideoResource, updateVideoResource,  deleteVideoResource} = require('../controllers/videoResourceController');


router.get('/', getAllVideoResources);
router.get('/:id', getVideoResourceById);
router.patch('/:id/upvote', authMiddleware, upvoteVideoResource);
router.patch('/:id', authMiddleware, updateVideoResource);
router.delete('/:id', authMiddleware, deleteVideoResource);

router.post('/', authMiddleware, restrictTo('senior', 'admin'), createVideoResource);

module.exports = router;