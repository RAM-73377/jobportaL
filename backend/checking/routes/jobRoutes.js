const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, requireEmployer } = require('../services/middlewareService');
const Job = require('../models/Job');
const Employer = require('../models/Employer');

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *               - employmentType
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *               experienceRequired:
 *                 type: string
 *               salaryMin:
 *                 type: integer
 *               salaryMax:
 *                 type: integer
 *               isRemote:
 *                 type: boolean
 *           example:
 *             title: "Senior Software Engineer"
 *             description: "We are looking for an experienced software engineer..."
 *             location: "New York"
 *             employmentType: "FULL_TIME"
 *             experienceRequired: "5+ years"
 *             salaryMin: 100000
 *             salaryMax: 150000
 *             isRemote: true
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     location:
 *                       type: string
 *                     employmentType:
 *                       type: string
 *                     experienceRequired:
 *                       type: string
 *                     salaryMin:
 *                       type: integer
 *                     salaryMax:
 *                       type: integer
 *                     isRemote:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not an employer
 */
router.post('/', 
    authenticateToken,
    requireEmployer,
    jobController.validateJobPost,
    jobController.createJob
);

/**
 * @swagger
 * /api/jobs/search:
 *   get:
 *     summary: Search jobs with filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by job title
 *       - in: query
 *         name: companyName
 *         schema:
 *           type: string
 *         description: Search by company name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Search by location
 *       - in: query
 *         name: employmentType
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *         description: Filter by employment type
 *       - in: query
 *         name: isRemote
 *         schema:
 *           type: boolean
 *         description: Filter remote jobs
 *       - in: query
 *         name: salaryMin
 *         schema:
 *           type: integer
 *         description: Minimum salary filter
 *       - in: query
 *         name: salaryMax
 *         schema:
 *           type: integer
 *         description: Maximum salary filter
 *     responses:
 *       200:
 *         description: List of jobs matching the criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       location:
 *                         type: string
 *                       employmentType:
 *                         type: string
 *                       experienceRequired:
 *                         type: string
 *                       salaryMin:
 *                         type: integer
 *                       salaryMax:
 *                         type: integer
 *                       isRemote:
 *                         type: boolean
 *                       Employer:
 *                         type: object
 *                         properties:
 *                           companyName:
 *                             type: string
 *                           logo:
 *                             type: string
 */
router.get('/search', jobController.searchJobs);

/**
 * @swagger
 * /api/jobs/search/quick:
 *   get:
 *     summary: Quick search jobs by title or company name
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for job title or company name
 *     responses:
 *       200:
 *         description: List of matching jobs
 */
router.get('/search/quick', jobController.searchByTitleOrCompany);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get('/:id', jobController.getJobById);

/**
 * @swagger
 * /api/jobs/all:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of all jobs
 */
router.get('/all', async (req, res) => {
    try {
        const jobs = await Job.findAll({
            include: [{
                model: Employer,
                attributes: ['companyName', 'logo']
            }],
            order: [['createdAt', 'DESC']]
        });
        
        console.log('Found jobs:', jobs.length); // Debug log
        
        res.json({
            success: true,
            data: jobs
        });
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        res.status(500).json({
            success: false,
            errors: [{
                field: 'server',
                message: 'Error fetching jobs'
            }]
        });
    }
});

module.exports = router; 