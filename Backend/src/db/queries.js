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
  // 1️⃣ Get all career skills ordered by priority
  const { rows: careerSkills } = await pool.query(
    `
    SELECT skill_id, priority
    FROM career_skills
    WHERE career_id = $1
    ORDER BY priority ASC
    `,
    [careerId]
  );

  // 2️⃣ Insert ALL skills into learning_path_items
  for (const skill of careerSkills) {
    await pool.query(
      `
      INSERT INTO learning_path_items
        (learning_path_id, skill_id, order_index, status)
      VALUES ($1, $2, $3, 'pending')
      `,
      [pathId, skill.skill_id, skill.priority]
    );
  }

  return true;
}

async function getLearningPathItems(pathId) {
  const { rows } = await pool.query(
    `
    SELECT
      lpi.id,
      lpi.skill_id AS "skillId",
      s.name AS "skillName",
      cs.required_level AS "requiredLevel",
      COALESCE(us.level, 0) AS level
    FROM learning_path_items lpi
    JOIN skills s ON s.id = lpi.skill_id
    JOIN career_skills cs ON cs.skill_id = s.id
    LEFT JOIN user_skills us
      ON us.skill_id = s.id
     AND us.user_id = (
        SELECT user_id FROM learning_paths WHERE id = $1
     )
    WHERE lpi.learning_path_id = $1
    ORDER BY lpi.order_index ASC
    `,
    [pathId]
  );

  return rows;
}

async function getUserLearningPath(userId) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM learning_paths
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}



// ================= PROGRESS =================

async function ensureUserSkillsForPath(userId, pathId) {
  await pool.query(
    `
    INSERT INTO user_skills (user_id, skill_id, level)
    SELECT $1, lpi.skill_id, 0
    FROM learning_path_items lpi
    WHERE lpi.learning_path_id = $2
    AND NOT EXISTS (
      SELECT 1 FROM user_skills us
      WHERE us.user_id = $1 AND us.skill_id = lpi.skill_id
    )
    `,
    [userId, pathId]
  );
}

async function updateUserSkillLevel(userId, skillId, level) {
  const { rows } = await pool.query(
    `
    UPDATE user_skills
    SET level = $3,
        updated_at = NOW()
    WHERE user_id = $1 AND skill_id = $2
    RETURNING *
    `,
    [userId, skillId, level]
  );

  return rows[0] || null;
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

async function getDashboardSummary(userId) {
  const { rows } = await pool.query(
    `
    SELECT
      c.name AS career,

      COALESCE(
        ROUND(
          SUM(us.level)::numeric /
          NULLIF(SUM(cs.required_level), 0) * 100
        ),
        0
      ) AS progress,

      (
        SELECT s.name
        FROM learning_path_items lpi2
        JOIN skills s ON s.id = lpi2.skill_id
        LEFT JOIN user_skills us2
          ON us2.skill_id = s.id
         AND us2.user_id = $1
        WHERE lpi2.learning_path_id = lp.id
          AND COALESCE(us2.level, 0) < cs.required_level
        ORDER BY lpi2.order_index
        LIMIT 1
      ) AS "nextSkill",

      COUNT(cs.skill_id) AS "totalSkills",
      COUNT(*) FILTER (WHERE us.level >= cs.required_level) AS "completedSkills"

    FROM learning_paths lp
    JOIN careers c ON c.id = lp.career_id
    JOIN career_skills cs ON cs.career_id = c.id
    LEFT JOIN user_skills us
      ON us.skill_id = cs.skill_id
     AND us.user_id = lp.user_id

    WHERE lp.user_id = $1
    ORDER BY lp.created_at DESC
    LIMIT 1

    GROUP BY lp.id, c.name
    `,
    [userId]
  );

  return rows[0] || null;
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
    getUserLearningPath,

    ensureUserSkillsForPath,
    updateUserSkillLevel,

    addResource,
    getResourcesBySkill,

    addProject,
    getProjectsBySkill,
    submitProject,
    getUserSubmissions,

    getTotalUsers,
    getMostChosenCareers,

    getDashboardSummary,
};