const { validationResult, check } = require('express-validator');
const jobService = require('../services/jobService');

// Validation middleware
const validateJobPost = [
    check('title')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Job title must be at least 2 characters long'),
    
    check('description')
        .notEmpty()
        .withMessage('Job description is required'),
    
    check('location')
        .notEmpty()
        .withMessage('Job location is required'),
    
    check('employmentType')
        .isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'])
        .withMessage('Valid employment type is required'),
    
    check('experienceRequired')
        .optional()
        .isString()
        .withMessage('Experience required must be a string'),
    
    check('skillsRequired')
        .optional()
        .isArray()
        .withMessage('Skills required must be an array'),
    
    check('salaryMin')
        .optional()
        .isNumeric()
        .withMessage('Minimum salary must be a number'),
    
    check('salaryMax')
        .optional()
        .isNumeric()
        .withMessage('Maximum salary must be a number')
        .custom((value, { req }) => {
            if (req.body.salaryMin && value < req.body.salaryMin) {
                throw new Error('Maximum salary must be greater than minimum salary');
            }
            return true;
        }),
    
    check('isRemote')
        .optional()
        .isBoolean()
        .withMessage('isRemote must be a boolean value')
];

const createJob = async (req, res) => {
    try {
        console.log('User in createJob:', req.user);  // See what user data we have
        
        // Check if user is an employer
        if (!req.user || req.user.role !== 'employer') {
            return res.status(401).json({
                success: false,
                errors: [{
                    field: 'authorization',
                    message: 'Only employers can post jobs'
                }]
            });
        }

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

        const result = await jobService.createJob(req.body, req.user.id);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error('Job creation error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while creating the job posting'
            }]
        });
    }
};

const searchJobs = async (req, res) => {
    try {
        const filters = {
            title: req.query.title,
            location: req.query.location,
            employmentType: req.query.employmentType,
            isRemote: req.query.isRemote === 'true',
            salaryMin: req.query.salaryMin ? parseInt(req.query.salaryMin) : undefined,
            salaryMax: req.query.salaryMax ? parseInt(req.query.salaryMax) : undefined
        };

        const result = await jobService.searchJobs(filters);
        return res.json(result);
    } catch (error) {
        console.error('Job search error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while searching jobs'
            }]
        });
    }
};

const getJobById = async (req, res) => {
    try {
        const jobId = parseInt(req.params.id);
        
        if (isNaN(jobId)) {
            return res.status(400).json({
                success: false,
                errors: [{
                    field: 'id',
                    message: 'Invalid job ID'
                }]
            });
        }

        const result = await jobService.getJobById(jobId);
        
        if (!result.success) {
            return res.status(404).json(result);
        }

        return res.json(result);
    } catch (error) {
        console.error('Job fetch error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while fetching the job'
            }]
        });
    }
};

const searchByTitleOrCompany = async (req, res) => {
    try {
        const { q } = req.query; // 'q' for query/search term

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                errors: [{
                    field: 'search',
                    message: 'Search term must be at least 2 characters long'
                }]
            });
        }

        const result = await jobService.searchByTitleOrCompany(q.trim());
        return res.json(result);
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'An error occurred while searching'
            }]
        });
    }
};

module.exports = {
    createJob,
    searchJobs,
    getJobById,
    searchByTitleOrCompany,
    validateJobPost
}; 