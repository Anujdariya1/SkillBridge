const express = require("express");
const {register, login, getMe, promoteToAdminHandler} = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/requireAdmin');

const router = express.Router();

// Public
router.post('/register', register);
router.post('/login', login);

// Logged-in user
router.get('/me', authMiddleware, getMe);

// Admin only
router.patch('/promote/:userId', authMiddleware, adminMiddleware, promoteToAdminHandler);

module.exports = router;