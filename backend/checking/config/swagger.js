const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Job Portal API',
            version: '1.0.0',
            description: 'Job Portal API Documentation',
        },
        servers: [
            {
                url: 'http://localhost:3002',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        tags: [
            {
                name: 'Auth',
                description: 'User authentication endpoints'
            },
            {
                name: 'Employer',
                description: 'Employer management endpoints'
            },
            {
                name: 'Jobs',
                description: 'Job management endpoints'
            }
        ]
    },
    apis: ['./routes/*.js']  // Only looking at route files
};

const specs = swaggerJsdoc(options);
module.exports = specs;

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - employmentType
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the job
 *         title:
 *           type: string
 *           description: The job title
 *         description:
 *           type: string
 *           description: Detailed job description
 *         location:
 *           type: string
 *           description: Job location
 *         employmentType:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *           description: Type of employment
 *         experienceRequired:
 *           type: string
 *           description: Required years of experience
 *         salaryMin:
 *           type: integer
 *           description: Minimum salary offered
 *         salaryMax:
 *           type: integer
 *           description: Maximum salary offered
 *         isRemote:
 *           type: boolean
 *           description: Whether the job is remote
 *         status:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, CLOSED]
 *           description: Current status of the job posting
 *         employerId:
 *           type: integer
 *           description: ID of the employer who posted the job
 *         postedDate:
 *           type: string
 *           format: date-time
 *           description: When the job was posted
 * 
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
 *                   $ref: '#/components/schemas/Job'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not an employer
 * 
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
 *                     $ref: '#/components/schemas/Job'
 * 
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
 *                     $ref: '#/components/schemas/Job'
 * 
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job not found
 */