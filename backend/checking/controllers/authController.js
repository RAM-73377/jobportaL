const { validationResult, check } = require('express-validator');
const userService = require('../services/userService');

// Validation middleware
const validateRegister = [
    check('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    
    check('phoneNumber')
        .optional()
        .isMobilePhone()
        .withMessage('Please enter a valid phone number')
];

const validateLogin = [
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
];

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(error => ({
                    field: error.param,
                    message: error.msg
                }))
            });
        }

        const result = await userService.registerUser(req.body);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while registering'
            }]
        });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(error => ({
                    field: error.param,
                    message: error.msg
                }))
            });
        }

        const result = await userService.loginUser(req.body.email, req.body.password);
        
        if (!result.success) {
            return res.status(401).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while logging in'
            }]
        });
    }
};

module.exports = {
    register,
    login,
    validateRegister,
    validateLogin
}; 