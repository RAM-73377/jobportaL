const { Op } = require('sequelize');
const Job = require('../models/Job');
const Employer = require('../models/Employer');
const sequelize = require('../config/database');  // Make sure to import sequelize

class JobService {
    // Build search query based on filters
    buildSearchQuery(filters) {
        const where = {};
        
        // Search conditions
        if (filters.title) {
            where.title = { [Op.like]: `%${filters.title}%` };
        }
        
        if (filters.keywords) {
            where.keywords = { [Op.like]: `%${filters.keywords}%` };
        }
        
        if (filters.location) {
            where.location = { [Op.like]: `%${filters.location}%` };
        }
        
        if (filters.company) {
            where.company = { [Op.like]: `%${filters.company}%` };
        }

        // Filter conditions
        if (filters.industry) {
            where.industry = filters.industry;
        }
        
        if (filters.experience) {
            where.experienceRequired = filters.experience;
        }
        
        if (filters.salaryMin) {
            where.salaryMax = { [Op.gte]: parseInt(filters.salaryMin) };
        }
        
        if (filters.salaryMax) {
            where.salaryMin = { [Op.lte]: parseInt(filters.salaryMax) };
        }
        
        if (filters.isRemote !== undefined) {
            where.isRemote = filters.isRemote === 'true';
        }
        
        if (filters.employmentType) {
            where.employmentType = filters.employmentType;
        }

        return where;
    }

    // Get sort order based on sortBy parameter
    getSortOrder(sortBy) {
        switch(sortBy) {
            case 'newest':
                return [['postedDate', 'DESC']];
            case 'salary':
                return [['salaryMax', 'DESC']];
            case 'relevant':
            default:
                return [['postedDate', 'DESC']];
        }
    }

    // Search jobs with filters
    async searchJobs(filters = {}) {
        try {
            const whereClause = {};
            
            if (filters.title) {
                whereClause[Op.or] = [
                    sequelize.where(
                        sequelize.fn('LOWER', sequelize.col('title')),
                        'LIKE',
                        `%${filters.title.toLowerCase()}%`
                    )
                ];
            }
            
            if (filters.location) {
                whereClause.location = sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('location')),
                    'LIKE',
                    `%${filters.location.toLowerCase()}%`
                );
            }
            
            if (filters.employmentType) {
                whereClause.employmentType = filters.employmentType;
            }

            console.log('Search where clause:', whereClause); // Debug log

            const jobs = await Job.findAll({
                where: whereClause,
                include: [{
                    model: Employer,
                    attributes: ['companyName', 'logo']
                }],
                order: [['createdAt', 'DESC']]
            });

            console.log('Found jobs:', jobs.length); // Debug log

            return {
                success: true,
                data: jobs
            };
        } catch (error) {
            console.error('Search error:', error);
            throw error;
        }
    }

    async searchByTitleOrCompany(searchTerm) {
        try {
            const lowerSearchTerm = searchTerm.toLowerCase();
            
            const jobs = await Job.findAll({
                where: {
                    [Op.or]: [
                        sequelize.where(
                            sequelize.fn('LOWER', sequelize.col('title')),
                            'LIKE',
                            `%${lowerSearchTerm}%`
                        ),
                        // Add any other job fields you want to search here
                    ]
                },
                include: [{
                    model: Employer,
                    attributes: ['companyName', 'logo'],
                    where: {
                        [Op.or]: [
                            sequelize.where(
                                sequelize.fn('LOWER', sequelize.col('companyName')),
                                'LIKE',
                                `%${lowerSearchTerm}%`
                            )
                        ]
                    },
                    required: false  // This makes it an LEFT OUTER JOIN instead of INNER JOIN
                }],
                order: [['createdAt', 'DESC']]
            });

            console.log('Quick search found jobs:', jobs.length); // Debug log
            console.log('Search term:', lowerSearchTerm); // Debug search term

            return {
                success: true,
                data: jobs
            };
        } catch (error) {
            console.error('Quick search error:', error);
            throw error;
        }
    }

    // Validate job data before creation
    validateJobData(jobData) {
        const errors = [];

        if (!jobData.title || jobData.title.length < 2) {
            errors.push({
                field: 'title',
                message: 'Job title must be at least 2 characters long'
            });
        }

        if (!jobData.description) {
            errors.push({
                field: 'description',
                message: 'Job description is required'
            });
        }

        if (!jobData.location) {
            errors.push({
                field: 'location',
                message: 'Job location is required'
            });
        }

        if (!jobData.employmentType || 
            !['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].includes(jobData.employmentType)) {
            errors.push({
                field: 'employmentType',
                message: 'Valid employment type is required'
            });
        }

        return errors;
    }

    // Create a new job
    async createJob(jobData, employerId) {
        try {
            const job = await Job.create({
                ...jobData,
                employerId,
                postedDate: new Date(),
                visibilityDate: jobData.visibilityDate || new Date()
            });

            return {
                success: true,
                data: job
            };
        } catch (error) {
            throw error;
        }
    }

    // Get job by ID
    async getJobById(jobId) {
        try {
            const job = await Job.findOne({
                where: { 
                    id: jobId,
                    status: 'PUBLISHED'
                },
                include: [{
                    model: Employer,
                    attributes: ['companyName', 'logo', 'website']
                }]
            });

            if (!job) {
                return {
                    success: false,
                    errors: [{
                        field: 'id',
                        message: 'Job not found'
                    }]
                };
            }

            return {
                success: true,
                data: job
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new JobService(); 