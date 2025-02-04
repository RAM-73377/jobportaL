const express = require('express');
const { validateApplyJob, applyJob } = require('../controllers/applyJobController');
const router = express.Router();
const ApplyJob = require('../models/ApplyJob');

/**
 * @swagger
 * tags:
 *   name: Job Applications
 *   description: Endpoints for managing job applications
 */

/**
 * @swagger
 * /api/apply:
 *   post:
 *     summary: Submit a job application
 *     tags: [Job Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - resume
 *               - coverLetter
 *               - jobTitle
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the applicant
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the applicant
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the applicant (10 digits)
 *               resume:
 *                 type: string
 *                 description: URL or path to the applicant's resume
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter submitted by the applicant
 *               jobTitle:
 *                 type: string
 *                 description: Title of the job being applied for
 *               applicationStatus:
 *                 type: string
 *                 enum: [Submitted, Reviewed, Rejected, Offered]
 *                 description: Status of the application (default is Submitted)
 *     responses:
 *       200:
 *         description: Job application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Job application submitted successfully
 *                 applyJob:
 *                   $ref: '#/components/schemas/ApplyJob'
 *       400:
 *         description: Validation error or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.post('/', (req, res, next) => {
    console.log('Apply job route hit!');
    next();
}, validateApplyJob, applyJob);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ApplyJob:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phoneNumber
 *         - resume
 *         - coverLetter
 *         - jobTitle
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the job application
 *         fullName:
 *           type: string
 *           description: Full name of the applicant
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the applicant
 *         phoneNumber:
 *           type: string
 *           description: Phone number of the applicant (10 digits)
 *         resume:
 *           type: string
 *           description: URL or path to the applicant's resume
 *         coverLetter:
 *           type: string
 *           description: Cover letter submitted by the applicant
 *         jobTitle:
 *           type: string
 *           description: Title of the job being applied for
 *         applicationStatus:
 *           type: string
 *           enum: [Submitted, Reviewed, Rejected, Offered]
 *           description: Status of the application
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the application was last updated
 */