const pool = require('./pool');
const bcrypt = require('bcryptjs');

// ================= AUTH =================

async function createUser(name, email, password) {
    const client = await pool.connect();
    try {
        const exists = await client.query('SELECT 1 FROM users WHERE email=$1', [email]);
        if (exists.rowCount > 0) throw new Error('Email already registered');

        const hash = await bcrypt.hash(password, 10);

        const res = await client.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1,$2,$3)
             RETURNING id, name, email, role`,
            [name, email, hash]
        );

        return res.rows[0];
    } finally {
        client.release();
    }
}

async function loginUser(email, password) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT id, name, email, role, password_hash FROM users WHERE email=$1',
            [email]
        );

        if (res.rowCount === 0) return null;

        const user = res.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
    } finally {
        client.release();
    }
}

async function getUserProfile(userId) {
    const { rows } = await pool.query(
        'SELECT id, name, email, role FROM users WHERE id=$1',
        [userId]
    );
    return rows[0] || null;
}

async function promoteToAdmin(userId) {
    await pool.query("UPDATE users SET role='admin' WHERE id=$1", [userId]);
    return true;
}

// ================= CAREERS =================

async function createCareer(title, description) {
    const { rows } = await pool.query(
        `INSERT INTO careers (title, description)
         VALUES ($1,$2) RETURNING *`,
        [title, description]
    );
    return rows[0];
}

async function updateCareer(id, title, description) {
    await pool.query(
        'UPDATE careers SET title=$1, description=$2 WHERE id=$3',
        [title, description, id]
    );
    return true;
}

async function deleteCareer(id) {
    await pool.query('DELETE FROM careers WHERE id=$1', [id]);
    return true;
}

async function getAllCareers() {
    const { rows } = await pool.query('SELECT * FROM careers ORDER BY id');
    return rows;
}

async function getCareerById(id) {
    const { rows } = await pool.query('SELECT * FROM careers WHERE id=$1', [id]);
    return rows[0] || null;
}

// ================= SKILLS =================

async function createSkill(name, category) {
    const { rows } = await pool.query(
        'INSERT INTO skills (name, category) VALUES ($1,$2) RETURNING *',
        [name, category]
    );
    return rows[0];
}

async function updateSkill(id, name, category) {
    await pool.query(
        'UPDATE skills SET name=$1, category=$2 WHERE id=$3',
        [name, category, id]
    );
    return true;
}

async function deleteSkill(id) {
    await pool.query('DELETE FROM skills WHERE id=$1', [id]);
    return true;
}

async function getAllSkills() {
    const { rows } = await pool.query('SELECT * FROM skills ORDER BY id');
    return rows;
}

// ================= CAREER SKILLS =================

async function addSkillToCareer(careerId, skillId, requiredLevel, priority) {
    await pool.query(
        `INSERT INTO career_skills (career_id, skill_id, required_level, priority)
         VALUES ($1,$2,$3,$4)`,
        [careerId, skillId, requiredLevel, priority]
    );
    return true;
}

async function updateCareerSkill(careerId, skillId, requiredLevel, priority) {
    await pool.query(
        `UPDATE career_skills
         SET required_level=$1, priority=$2
         WHERE career_id=$3 AND skill_id=$4`,
        [requiredLevel, priority, careerId, skillId]
    );
    return true;
}

async function deleteCareerSkill(careerId, skillId) {
    await pool.query(
        'DELETE FROM career_skills WHERE career_id=$1 AND skill_id=$2',
        [careerId, skillId]
    );
    return true;
}

async function getCareerRoadmap(careerId) {
    const { rows } = await pool.query(
        `SELECT s.id, s.name, s.category, cs.required_level, cs.priority
         FROM career_skills cs
         JOIN skills s ON s.id = cs.skill_id
         WHERE cs.career_id=$1
         ORDER BY cs.priority ASC`,
        [careerId]
    );
    return rows;
}

// ================= USER SKILLS =================

async function upsertUserSkill(userId, skillId, level) {
    await pool.query(
        `INSERT INTO user_skills (user_id, skill_id, level)
         VALUES ($1,$2,$3)
         ON CONFLICT (user_id, skill_id)
         DO UPDATE SET level = EXCLUDED.level`,
        [userId, skillId, level]
    );
    return true;
}

async function getUserSkills(userId) {
    const { rows } = await pool.query(
        `SELECT s.id, s.name, s.category, us.level
         FROM user_skills us
         JOIN skills s ON s.id = us.skill_id
         WHERE us.user_id=$1`,
        [userId]
    );
    return rows;
}

// ================= LEARNING PATH =================

async function createLearningPath(userId, careerId) {
    const { rows } = await pool.query(
        `INSERT INTO learning_paths (user_id, career_id)
         VALUES ($1,$2) RETURNING id`,
        [userId, careerId]
    );
    return rows[0].id;
}

async function generateLearningPathItems(pathId, userId, careerId) {
    await pool.query(
        `INSERT INTO learning_path_items (learning_path_id, skill_id, order_index)
         SELECT $1, cs.skill_id, cs.priority
         FROM career_skills cs
         LEFT JOIN user_skills us
           ON us.skill_id = cs.skill_id AND us.user_id = $2
         WHERE cs.career_id = $3
           AND COALESCE(us.level,0) < cs.required_level`,
        [pathId, userId, careerId]
    );
    return true;
}

async function getLearningPathItems(pathId) {
    const { rows } = await pool.query(
        `SELECT lpi.id, s.name, s.category, lpi.order_index, lpi.status
         FROM learning_path_items lpi
         JOIN skills s ON s.id = lpi.skill_id
         WHERE lpi.learning_path_id=$1
         ORDER BY lpi.order_index`,
        [pathId]
    );
    return rows;
}

// ================= PROGRESS =================

async function markSkillCompleted(itemId) {
    await pool.query(
        `UPDATE learning_path_items
         SET status='completed', completed_at=NOW()
         WHERE id=$1`,
        [itemId]
    );
    return true;
}

async function getProgressPercentage(pathId) {
    const { rows } = await pool.query(
        `SELECT
            COUNT(*) FILTER (WHERE status='completed') * 100.0 /
            NULLIF(COUNT(*),0) AS progress
         FROM learning_path_items
         WHERE learning_path_id=$1`,
        [pathId]
    );
    return rows[0].progress || 0;
}

// ================= RESOURCES =================

async function addResource(skillId, title, url) {
    await pool.query(
        'INSERT INTO resources (skill_id, title, url) VALUES ($1,$2,$3)',
        [skillId, title, url]
    );
    return true;
}

async function getResourcesBySkill(skillId) {
    const { rows } = await pool.query(
        'SELECT * FROM resources WHERE skill_id=$1',
        [skillId]
    );
    return rows;
}

// ================= PROJECTS =================

async function addProject(skillId, title, description) {
    await pool.query(
        'INSERT INTO projects (skill_id, title, description) VALUES ($1,$2,$3)',
        [skillId, title, description]
    );
    return true;
}

async function getProjectsBySkill(skillId) {
    const { rows } = await pool.query(
        'SELECT * FROM projects WHERE skill_id=$1',
        [skillId]
    );
    return rows;
}

async function submitProject(userId, projectId, submissionUrl) {
    await pool.query(
        'INSERT INTO submissions (user_id, project_id, submission_url) VALUES ($1,$2,$3)',
        [userId, projectId, submissionUrl]
    );
    return true;
}

async function getUserSubmissions(userId) {
    const { rows } = await pool.query(
        'SELECT * FROM submissions WHERE user_id=$1',
        [userId]
    );
    return rows;
}

// ================= ADMIN ANALYTICS =================

async function getTotalUsers() {
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    return Number(rows[0].count);
}

async function getMostChosenCareers() {
    const { rows } = await pool.query(
        `SELECT career_id, COUNT(*) as total
         FROM learning_paths
         GROUP BY career_id
         ORDER BY total DESC`
    );
    return rows;
}

// ================= EXPORTS =================

module.exports = {
    createUser,
    loginUser,
    getUserProfile,
    promoteToAdmin,

    createCareer,
    updateCareer,
    deleteCareer,
    getAllCareers,
    getCareerById,

    createSkill,
    updateSkill,
    deleteSkill,
    getAllSkills,

    addSkillToCareer,
    updateCareerSkill,
    deleteCareerSkill,
    getCareerRoadmap,

    upsertUserSkill,
    getUserSkills,

    createLearningPath,
    generateLearningPathItems,
    getLearningPathItems,

    markSkillCompleted,
    getProgressPercentage,

    addResource,
    getResourcesBySkill,

    addProject,
    getProjectsBySkill,
    submitProject,
    getUserSubmissions,

    getTotalUsers,
    getMostChosenCareers,
};