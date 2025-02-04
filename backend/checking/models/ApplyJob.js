const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ApplyJob = sequelize.define('ApplyJob', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{10}$/ // Validates 10 digits
        }
    },
    resume: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coverLetter: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    applicationStatus: {
        type: DataTypes.ENUM('Submitted', 'Reviewed', 'Rejected', 'Offered'),
        allowNull: false,
        defaultValue: 'Submitted'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = ApplyJob;
