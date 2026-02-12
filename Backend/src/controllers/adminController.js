const {getTotalUsers, getMostChosenCareers} = require('../db/queries');

async function getTotalUsersHandler(req, res) {
    try {
        const totalUsers = await getTotalUsers();
        return res.json({ totalUsers });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getMostChosenCareersHandler(req, res) {
    try {
        const careers = await getMostChosenCareers();
        return res.json(careers);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    getTotalUsersHandler,
    getMostChosenCareersHandler
};