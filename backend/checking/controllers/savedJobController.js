const savedJobService = require('../services/savedJobService');
const { validationResult, check } = require('express-validator');

const validateSaveJob = [
    check('category')
        .optional()
        .isIn(['HIGH_PRIORITY', 'INTERESTED', 'APPLIED', 'NONE'])
        .withMessage('Invalid category'),
    check('notes')
        .optional()
        .isString()
        .withMessage('Notes must be a string')
];

const saveJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { jobId, category, notes } = req.body;
        const userId = req.user.id;

        const result = await savedJobService.saveJob(userId, jobId, category, notes);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Save job error:', error);
        return res.status(400).json({
            success: false,
            errors: [{
                field: 'general',
                message: error.message
            }]
        });
    }
};

const updateSavedJob = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const jobId = parseInt(req.params.jobId);
        const { category, notes } = req.body;
        const userId = req.user.id;

        console.log('Received parameters - userId:', userId, 'jobId:', jobId, 'category:', category, 'notes:', notes);

        const result = await savedJobService.updateSavedJob(userId, jobId, category, notes);

        console.log('Update saved job result:', result);

        return res.json(result);
    } catch (error) {
        console.error('Update saved job error:', error);
        return res.status(400).json({
            success: false,
            errors: [{
                field: 'general',
                message: error.message
            }]
        });
    }
};

const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.id;

        const result = await savedJobService.unsaveJob(userId, jobId);
        return res.json(result);
    } catch (error) {
        console.error('Unsave job error:', error);
        return res.status(400).json({
            success: false,
            errors: [{
                field: 'general',
                message: error.message
            }]
        });
    }
};

const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { category } = req.query;

        const result = await savedJobService.getSavedJobs(userId, category);
        return res.json(result);
    } catch (error) {
        console.error('Get saved jobs error:', error);
        return res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'Error fetching saved jobs'
            }]
        });
    }
};

module.exports = {
    validateSaveJob,
    saveJob,
    updateSavedJob,
    unsaveJob,
    getSavedJobs
}; 