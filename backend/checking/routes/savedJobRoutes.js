const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/savedJobController');
const { authenticateToken } = require('../services/middlewareService');

/**
 * @swagger
 * /api/saved-jobs:
 *   post:
 *     summary: Save a job
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: integer
 *               category:
 *                 type: string
 *                 enum: [HIGH_PRIORITY, INTERESTED, APPLIED, NONE]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job saved successfully
 */
router.post('/', 
    authenticateToken,
    savedJobController.validateSaveJob,
    savedJobController.saveJob
);

/**
 * @swagger
 * /api/saved-jobs/{jobId}:
 *   put:
 *     summary: Update saved job category or notes
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 enum: [HIGH_PRIORITY, INTERESTED, APPLIED, NONE]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Saved Job updated successfully
 */
router.put('/:jobId',
    authenticateToken,
    savedJobController.validateSaveJob,
    savedJobController.updateSavedJob
);


/**
 * @swagger
 * /api/saved-jobs/{jobId}:
 *   delete:
 *     summary: Remove job from saved list
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: jobId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job to delete
 *     responses:
 *       204:
 *         description: Job removed successfully
 */
router.delete('/:jobId',
    authenticateToken,
    savedJobController.unsaveJob
);

/**
 * @swagger
 * /api/saved-jobs:
 *   get:
 *     summary: Get all saved jobs
 *     tags: [Saved Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [HIGH_PRIORITY, INTERESTED, APPLIED, NONE]
 */
router.get('/',
    authenticateToken,
    savedJobController.getSavedJobs
);

module.exports = router;
