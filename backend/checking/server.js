const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger');
const routes = require('./routes');
const Job = require('./models/Job');
const Employer = require('./models/Employer');
const User = require('./models/User');
const db = require('./config/database');  // Import your database configuration
const savedJobRoutes = require('./routes/savedJobRoutes');
const sequelize = require('./config/database');
const SavedJob = require('./models/SavedJob');
const ApplyJob = require('./models/ApplyJob');
//const applyJobRoutes = require('./routes/applyJobRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use('/api', routes);

// Define relationships
Job.belongsTo(Employer, { foreignKey: 'employerId' });
Employer.hasMany(Job, { foreignKey: 'employerId' });

// Sync all models
sequelize.sync()
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/apply', require('./routes/applyJobRoutes'));


// Initialize database and start server
const PORT = process.env.PORT || 3002;

const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
};

startServer();

// Log route hits
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Route hit:', req.path);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        errors: [{
            field: 'server',
            message: 'Something broke!'
        }]
    });
});