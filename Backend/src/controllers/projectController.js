const {addProject, getProjectsBySkill, submitProject, getUserSubmissions} = require('../db/queries');

async function addProjectHandler(req, res) {
    try {
        const { skillId, title, description, url } = req.body;
        if (!skillId || !title || !description || !url) {
            return res.status(400).json({ message: 'Skill ID, Title, Description and URL are required' });
        }
        await addProject(skillId, title, description, url);
        return res.status(201).json({ message: 'Project added successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getProjectsBySkillHandler(req, res) {
    try {
        const { skillId } = req.params;
        const projects = await getProjectsBySkill(skillId);
        return res.json(projects);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function submitProjectHandler(req, res) {
    try {
        const { userId, projectId, submissionUrl } = req.body;
        if (!userId || !projectId || !submissionUrl) {
            return res.status(400).json({ message: 'User ID, Project ID and Submission URL are required' });
        }
        await submitProject(userId, projectId, submissionUrl);
        return res.status(201).json({ message: 'Project submitted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

async function getUserSubmissionsHandler(req, res) {
    try {
        const { userId } = req.params;
        const submissions = await getUserSubmissions(userId);
        return res.json(submissions);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addProjectHandler,
    getProjectsBySkillHandler,
    submitProjectHandler,
    getUserSubmissionsHandler
}