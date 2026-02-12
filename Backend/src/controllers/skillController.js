const {createSkill, updateSkill, deleteSkill, getAllSkills} = require('../db/queries');

async function createSkillHandler(req, res) {
    try {
        // Validate input
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }
        const { name, description } = req.body;
        const skill = await createSkill(name, description);
        res.status(201).json(skill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function updateSkillHandler(req, res) {
    try {
        // Validate input
        if (!req.body.name || !req.body.description) {
            return res.status(400).json({ message: 'Name and description are required' });
        }
        const { id } = req.params;
        const { name, description } = req.body;
        await updateSkill(id, name, description);
        res.json({ message: 'Skill updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteSkillHandler(req, res) {
    try {
        const { id } = req.params;
        await deleteSkill(id);
        res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getAllSkillsHandler(req, res) {
    try {
        const skills = await getAllSkills();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createSkillHandler,
    updateSkillHandler,
    deleteSkillHandler,
    getAllSkillsHandler
};