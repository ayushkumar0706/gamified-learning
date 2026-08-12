const { body, validationResult } = require('express-validator');

const registerValidation = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').optional().isInt({ min: 14, max: 30 }).withMessage('Age must be between 14 and 30'),
    body('gender').optional().isIn(['male', 'female', 'others']).withMessage('Invalid gender value'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = { registerValidation, loginValidation, handleValidationErrors };