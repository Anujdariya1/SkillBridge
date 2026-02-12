const { createUser, loginUser, getUserProfile, promoteToAdmin } = require('../db/queries');
const generateToken = require('../utils/generateToken');

// ================= REGISTER =================
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await createUser(name, email, password);

        const token = generateToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

// ================= LOGIN =================
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(email, password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        return res.json({ user, token });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

async function promoteToAdminHandler(req, res) {
    try {
        const { userId } = req.params;

        await promoteToAdmin(userId);

        return res.json({ message: 'User promoted to admin successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// ================= GET ME =================
async function getMe(req, res) {
    try {
        const user = await getUserProfile(req.user.id);
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    register,
    login,
    promoteToAdminHandler,
    getMe
};
