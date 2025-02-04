const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Debug logging
router.use((req, res, next) => {
    console.log('Auth route hit:', req.path);
    console.log('Request body:', req.body);
    next();
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', 
    (req, res, next) => {
        console.log('Register middleware start');
        next();
    },
    authController.validateRegister,
    (req, res, next) => {
        console.log('Validation complete');
        next();
    },
    authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
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
    authController.validateLogin, 
    authController.login
);

module.exports = router; 