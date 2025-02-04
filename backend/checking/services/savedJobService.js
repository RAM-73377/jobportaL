const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const Employer = require('../models/Employer');

class SavedJobService {
    async saveJob(userId, jobId, category = 'NONE', notes = null) {
        try {
            console.log(`Checking if job with userId=${userId} and jobId=${jobId} already exists`);
            const existingSave = await SavedJob.findOne({
                where: { userId, jobId }
            });

            if (existingSave) {
                console.log('Job already saved.');
                throw new Error('Job already saved');
            }
            console.log(`Creating new saved job with userId=${userId}, jobId=${jobId}, category=${category}, notes=${notes}`);

            const savedJob = await SavedJob.create({
                userId,
                jobId,
                category,
                notes
            });

            console.log('Saved job created:', savedJob);
            return {
                success: true,
                data: savedJob
            };
        } catch (error) {
            console.error('Error saving job:', error);
            throw error;
        }
    }

    // async saveJob(req, res) {
    //     try {
    //         const { jobId, category, notes } = req.body;
    //         const userId = req.user.id;
    
    //         console.log("Received payload:", req.body);
    //         console.log("User ID from token:", userId);
    
    //         console.log(`Checking if job with userId=${userId} and jobId=${jobId} already exists`);
    //         const existingSave = await SavedJob.findOne({
    //             where: { userId, jobId }
    //         });
    
    //         if (existingSave) {
    //             console.log('Job already saved.');
    //             throw new Error('Job already saved');
    //         }
    //         console.log(`Creating new saved job with userId=${userId}, jobId=${jobId}, category=${category}, notes=${notes}`);
    
    //         const savedJob = await SavedJob.create({
    //             userId,
    //             jobId,
    //             category,
    //             notes
    //         });
    
    //         console.log('Saved job created:', savedJob);
    //         res.status(201).json(savedJob);
    //     } catch (error) {
    //         console.error('Error saving job:', error);
    //         res.status(500).json({ error: "Failed to save job" });
    //     }
    // }
    
    async updateSavedJob(userId, jobId, category, notes) {
        try {
            console.log("Updating saved job with userId:", userId, "and jobId:", jobId);  // Debug log
            const savedJob = await SavedJob.findOne({
                where: { userId, jobId }
            });

            if (!savedJob) {
                console.log('Saved job not found.');
                throw new Error('Saved job not found');
            }

            savedJob.category = category;
            savedJob.notes = notes;
            await savedJob.save();

            console.log('Saved job updated:', savedJob);
            return {
                success: true,
                message: 'Saved job updated successfully'
            };
        } catch (error) {
            throw error;
        }
    }

    // async updateSavedJob(userId, jobId, category, notes) {
    //     try {
    //         console.log("Updating saved job with userId:", userId, "and jobId:", jobId);  // Debug log
    //         const savedJob = await SavedJob.findOne({
    //             where: { userId, jobId }
    //         });
    
    //         if (!savedJob) {
    //             console.log('Saved job not found.');
    //             throw new Error('Saved job not found');
    //         }
    
    //         savedJob.category = category;
    //         savedJob.notes = notes;
    //         await savedJob.save();
    
    //         console.log('Saved job updated:', savedJob);
    //         return {
    //             success: true,
    //             message: 'Saved job updated successfully'
    //         };
    //     } catch (error) {
    //         console.error('Error updating saved job:', error);
    //         throw error;
    //     }
    // }    

    async unsaveJob(userId, jobId) {
        try {
            const result = await SavedJob.destroy({
                where: { userId, jobId }
            });

            if (!result) {
                throw new Error('Saved job not found');
            }

            return {
                success: true,
                message: 'Job removed from saved list'
            };
        } catch (error) {
            throw error;
        }
    }

    async getSavedJobs(userId, category = null) {
        try {
            const whereClause = { userId };
            if (category) {
                whereClause.category = category;
            }

            const savedJobs = await SavedJob.findAll({
                where: whereClause,
                include: [{
                    model: Job,
                    include: [{
                        model: Employer,
                        attributes: ['companyName', 'logo']
                    }]
                }],
                order: [['createdAt', 'DESC']]
            });

            return {
                success: true,
                data: savedJobs
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new SavedJobService(); 