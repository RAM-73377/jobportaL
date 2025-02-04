const userService = require('../services/userService');
const { validationResult, check } = require('express-validator');

// Validation middleware
const validateProfileCreate = [
    check('firstName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),
    
    check('lastName')
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),
    
    // Add other profile field validations as needed
];

const createUserProfile = async (req, res) => {
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

        const result = await userService.createProfile({
            userId: req.user.id,
            ...req.body
        });

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error('Profile creation error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while creating profile'
            }]
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const result = await userService.getProfile(req.user.id);
        
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while fetching profile'
            }]
        });
    }
};

module.exports = {
    createUserProfile,
    getUserProfile,
    validateProfileCreate
}; 