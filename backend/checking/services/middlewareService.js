const authService = require('./authService');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log('Token received:', token ? 'Yes' : 'No');

        if (!token) {
            return res.status(401).json({
                success: false,
                errors: [{
                    field: 'authorization',
                    message: 'No token provided'
                }]
            });
        }

        const decoded = await authService.verifyToken(token);
        console.log('Decoded token:', decoded);  // See what's in the token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            errors: [{
                field: 'authorization',
                message: 'Invalid token'
            }]
        });
    }
};

const requireEmployer = (req, res, next) => {
    console.log('User object in requireEmployer:', req.user);  // See what user data we have
    if (!req.user || req.user.role !== 'employer') {
        return res.status(403).json({
            success: false,
            errors: [{
                field: 'authorization',
                message: 'Only employers can access this resource'
            }]
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireEmployer
}; 