const express = require('express');
const { getJobs, requestReferral } = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getJobs);
router.post('/:id/referral', authMiddleware, requestReferral);

module.exports = router;
