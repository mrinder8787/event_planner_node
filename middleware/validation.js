const { body, validationResult } = require('express-validator');

exports.validateRegistration = [
  body('email').isEmail().withMessage('Please enter a valid email address.'),

  body('otp')
    .isNumeric()
    .withMessage('OTP must be a numeric value.')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits long.'),

  (req, res, next) => {
    const errors = validationResult(req).array({ onlyFirstError: true }); 
    if (errors.length > 0) {
      return res.status(400).json({
        error: true,
        message: errors.map(error => error.msg).join(', '),
      });
    }
    next();
  },
];
