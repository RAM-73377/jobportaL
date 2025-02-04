const applyJobService = require('../services/applyJobService');
const { validationResult, check } = require('express-validator');

const validateApplyJob = [
    check('fullName')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),

    check('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),

    check('phoneNumber')
        .trim()
        .isMobilePhone()
        .withMessage('Please enter a valid phone number'),

    check('resume')
        .notEmpty()
        .withMessage('Resume is required'),

    check('coverLetter')
        .notEmpty()
        .withMessage('Cover letter is required'),
 
    check('jobTitle')
        .notEmpty()
        .withMessage('Job title is required'),

    check('applicationStatus')
        .optional()
        .isIn(['Submitted', 'Reviewed', 'Rejected', 'Offered'])
        .withMessage('Invalid application status'),
]

const applyJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, phoneNumber, resume, coverLetter, jobTitle, applicationStatus } = req.body;
    const applyJob = await applyJobService.applyJob(fullName, email, phoneNumber, resume, coverLetter, jobTitle, applicationStatus);
    return res.status(200).json({ message: 'Job application submitted successfully', applyJob });
}

module.exports = { validateApplyJob, applyJob };
