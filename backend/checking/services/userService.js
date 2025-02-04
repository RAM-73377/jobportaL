const { Op } = require('sequelize');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const authService = require('./authService');

class UserService {
    async registerUser(userData) {
        try {
            // Check for existing user
            const existingUser = await User.findOne({
                where: { email: userData.email }
            });

            if (existingUser) {
                return {
                    success: false,
                    errors: [{ field: 'email', message: 'Email already registered' }]
                };
            }

            // Hash password using the same authService as employer
            const hashedPassword = await authService.hashPassword(userData.password);
            
            // Create user
            const user = await User.create({
                ...userData,
                password: hashedPassword,
                role: 'user'
            });

            // Generate token with role information (matching employer pattern)
            const token = authService.generateToken({
                id: user.id,
                role: 'user'
            });

            return {
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber
                    }
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return {
                    success: false,
                    errors: [{ field: 'email', message: 'User not found' }]
                };
            }

            const isPasswordValid = await authService.comparePassword(password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    errors: [{ field: 'password', message: 'Invalid password' }]
                };
            }

            // Generate token with role (matching employer pattern)
            const token = authService.generateToken({
                id: user.id,
                role: 'user'
            });

            return {
                success: true,
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async createProfile(profileData) {
        try {
            const profile = await User.update(
                profileData,
                { 
                    where: { id: profileData.userId },
                    returning: true
                }
            );

            if (!profile[0]) {
                return {
                    success: false,
                    errors: [{
                        field: 'user',
                        message: 'User not found'
                    }]
                };
            }

            return {
                success: true,
                data: profile[1][0]
            };
        } catch (error) {
            throw error;
        }
    }

    async getProfile(userId) {
        try {
            const profile = await User.findByPk(userId, {
                attributes: { exclude: ['password'] }
            });

            if (!profile) {
                return {
                    success: false,
                    errors: [{
                        field: 'user',
                        message: 'Profile not found'
                    }]
                };
            }

            return {
                success: true,
                data: profile
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService(); 