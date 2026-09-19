const express = require('express');
const { getSeniors, bookSession, getMyBookings } = require('../controllers/seniorController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Get seniors for the current user's college
router.get('/', authMiddleware, getSeniors);

// Book a session with a senior
router.post('/:seniorId/book', authMiddleware, bookSession);

// Get my booked sessions
router.get('/bookings/my-bookings', authMiddleware, getMyBookings);

module.exports = router;
