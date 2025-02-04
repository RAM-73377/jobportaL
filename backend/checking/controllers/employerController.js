const { validationResult, check } = require('express-validator');
const employerService = require('../services/employerService');

// Validation middleware
const validateEmployerRegister = [
    check('personName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    
    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    
    check('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    
    check('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    
    check('companyName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Company name must be at least 2 characters long'),
    
    check('website')
        .optional()
        .isURL()
        .withMessage('Please enter a valid website URL'),
    
    check('logo')
        .optional()
        .isURL()
        .withMessage('Please enter a valid logo URL')
];

const validateEmployerLogin = [
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

const registerEmployer = async (req, res) => {
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

        if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                success: false,
                errors: [{
                    field: 'confirmPassword',
                    message: 'Passwords do not match'
                }]
            });
        }

        const result = await employerService.registerEmployer(req.body);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error('Employer registration error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while registering employer'
            }]
        });
    }
};

const loginEmployer = async (req, res) => {
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

        const result = await employerService.loginEmployer(req.body.email, req.body.password);
        
        if (!result.success) {
            return res.status(401).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('Employer login error:', error);
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
    registerEmployer,
    loginEmployer,
    validateEmployerRegister,
    validateEmployerLogin
}; 