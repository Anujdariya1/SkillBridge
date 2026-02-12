function requireAdmin(req, res, next) {
    try {
        // auth middleware must run before this
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = requireAdmin;
