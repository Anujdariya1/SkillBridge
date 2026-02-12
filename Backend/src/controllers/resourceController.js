const {addResource, getResourcesBySkill} = require('../db/queries');

async function addResourceHandler(req, res) {
    try {
        const { skillId, title, url, type } = req.body;
        if (!skillId || !title || !url || !type) {
            return res.status(400).json({ message: 'Skill ID, Title, URL and Type are required' });
        }
        await addResource(skillId, title, url, type);
        return res.status(201).json({ message: 'Resource added successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getResourcesBySkillHandler(req, res) {
    try {
        const { skillId } = req.params;
        const resources = await getResourcesBySkill(skillId);
        return res.json(resources);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addResourceHandler,
    getResourcesBySkillHandler
};