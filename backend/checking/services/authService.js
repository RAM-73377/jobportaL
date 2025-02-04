const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');

class AuthService {
    generateToken(payload) {
        try {
            return jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
        } catch (error) {
            console.error('Token generation error:', error);
            throw error;
        }
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService(); 