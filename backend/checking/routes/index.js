const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const employerRoutes = require('./employerRoutes');
const jobRoutes = require('./jobRoutes');
const savedJobRoutes = require('./savedJobRoutes');
const applyJobRoutes = require('./applyJobRoutes');

// Debug logging
router.use((req, res, next) => {
    console.log('Route hit:', req.path);
    next();
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/employer', employerRoutes);
router.use('/jobs', jobRoutes);
router.use('/saved-jobs', savedJobRoutes);
router.use('/apply', applyJobRoutes);

module.exports = router; 