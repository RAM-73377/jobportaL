const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Job = require('./Job');

const SavedJob = sequelize.define('SavedJob', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.ENUM('HIGH_PRIORITY', 'INTERESTED', 'APPLIED', 'NONE'),
        defaultValue: 'NONE'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Set up associations correctly
User.hasMany(SavedJob);
SavedJob.belongsTo(User);
Job.hasMany(SavedJob);
SavedJob.belongsTo(Job);

module.exports = SavedJob; 