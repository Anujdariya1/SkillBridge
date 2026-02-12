const {markSkillCompleted, getProgressPercentage} = require('../db/queries');

async function markSkillCompletedHandler(req, res) {
    try {
        const { userId, skillId } = req.body;
        if (!userId || !skillId) {
            return res.status(400).json({ message: 'User ID and Skill ID are required' });
        }
        await markSkillCompleted(userId, skillId);
        return res.json({ message: 'Skill marked as completed' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getProgressPercentageHandler(req, res) {
    try {
        const { userId, careerId } = req.params;
        const percentage = await getProgressPercentage(userId, careerId);
        return res.json({ percentage });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    markSkillCompletedHandler,
    getProgressPercentageHandler
};