const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  employmentType: {
    type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'),
    allowNull: false
  },
  experienceRequired: {
    type: DataTypes.STRING,
    allowNull: true
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CLOSED'),
    defaultValue: 'PUBLISHED'
  },
  postedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  visibilityDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Job; 