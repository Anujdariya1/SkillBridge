const {upsertUserSkill, getUserSkills} = require('../db/queries');

async function upsertUserSkillHandler(req, res) {
    try {
        const { userId, skillId, level } = req.body;
        if (!userId || !skillId || !level) {
            return res.status(400).json({ message: 'User ID, Skill ID and Level are required' });
        }
        await upsertUserSkill(userId, skillId, level);
        return res.status(201).json({ message: 'User skill upserted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getUserSkillsHandler(req, res) {
    try {
        const { userId } = req.params;
        const skills = await getUserSkills(userId);
        return res.json(skills);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    upsertUserSkillHandler,
    getUserSkillsHandler
};