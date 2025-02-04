const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

/**
 * @swagger
 * /api/employer/register:
 *   post:
 *     summary: Register a new employer
 *     tags: [Employer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personName
 *               - companyName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               personName:
 *                 type: string
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               website:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employer registered successfully
 */
router.post('/register', 
    employerController.validateEmployerRegister, 
    employerController.registerEmployer
);

/**
 * @swagger
 * /api/employer/login:
 *   post:
 *     summary: Login employer
 *     tags: [Employer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', 
    employerController.validateEmployerLogin, 
    employerController.loginEmployer
);

module.exports = router; 