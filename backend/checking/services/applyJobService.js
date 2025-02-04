const ApplyJob = require('../models/ApplyJob');
const Job = require('../models/Job');
const User = require('../models/User');
const Employer = require('../models/Employer');

class ApplyJobService {
    async applyJob(fullName, email, phoneNumber, resume, coverLetter, jobTitle, applicationStatus) {
        const applyJob = await ApplyJob.create({
            fullName,
            email,
            phoneNumber,
            resume,
            coverLetter,
            jobTitle,
            applicationStatus
        });
        return applyJob;
    }
}

module.exports = new ApplyJobService();
