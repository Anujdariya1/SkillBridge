const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    try {
        const header = req.headers.authorization;

        // Check token present
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token' });
        }

        const token = header.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = auth;
