const { Op } = require('sequelize');
const Employer = require('../models/Employer');
const authService = require('./authService');

class EmployerService {
    async registerEmployer(employerData) {
        try {
            // Check for existing employer
            const existingEmployer = await Employer.findOne({
                where: {
                    [Op.or]: [
                        { email: employerData.email },
                        { companyName: employerData.companyName }
                    ]
                }
            });

            if (existingEmployer) {
                const errors = [];
                if (existingEmployer.email === employerData.email) {
                    errors.push({ field: 'email', message: 'Email already registered' });
                }
                if (existingEmployer.companyName === employerData.companyName) {
                    errors.push({ field: 'companyName', message: 'Company name already registered' });
                }
                return { success: false, errors };
            }

            // Create employer
            const hashedPassword = await authService.hashPassword(employerData.password);
            const employer = await Employer.create({
                ...employerData,
                password: hashedPassword
            });

            // Generate token with role information
            const token = authService.generateToken({
                id: employer.id,
                role: 'employer'  // Add role information
            });

            return {
                success: true,
                data: {
                    token,
                    employer: {
                        id: employer.id,
                        personName: employer.personName,
                        email: employer.email,
                        companyName: employer.companyName
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async loginEmployer(email, password) {
        try {
            const employer = await Employer.findOne({ where: { email } });

            if (!employer) {
                return {
                    success: false,
                    errors: [{ field: 'email', message: 'Employer not found' }]
                };
            }

            const isPasswordValid = await authService.comparePassword(password, employer.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    errors: [{ field: 'password', message: 'Invalid password' }]
                };
            }

            // Generate token with role information
            const token = authService.generateToken({
                id: employer.id,
                role: 'employer'  // Add role information
            });

            return {
                success: true,
                data: {
                    token,
                    employer: {
                        id: employer.id,
                        personName: employer.personName,
                        email: employer.email,
                        companyName: employer.companyName
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new EmployerService(); 