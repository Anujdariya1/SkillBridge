const { getTotalUsers, getMostChosenCareers } = require('../db/queries');
const pool = require('../db/pool');

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

async function createCareerHandler(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Career name is required' });
        }

        const result = await pool.query(
            `INSERT INTO careers (name, description)
             VALUES ($1, $2)
             RETURNING *`,
            [name, description || null]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function createSkillHandler(req, res) {
    try {
        const { name, category } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Skill name is required' });
        }

        const result = await pool.query(
            `INSERT INTO skills (name, category)
             VALUES ($1, $2)
             RETURNING *`,
            [name, category || null]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function mapSkillToCareerHandler(req, res) {
    try {
        const { career_id, skill_id, required_level, priority } = req.body;

        if (!career_id || !skill_id || priority === undefined) {
            return res.status(400).json({
                message: 'career_id, skill_id, and priority are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO career_skills (career_id, skill_id, required_level, priority)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [career_id, skill_id, required_level ?? 0, priority]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {
    getTotalUsersHandler,
    getMostChosenCareersHandler,
    createCareerHandler,
    createSkillHandler,
    mapSkillToCareerHandler
};
