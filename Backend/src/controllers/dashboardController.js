const pool = require("../db/pool");

async function getDashboardHandler(req, res) {
  try {
    const userId = req.user.id;

    // 1️⃣ Get latest learning path + career
    const pathResult = await pool.query(
      `
      SELECT lp.career_id, c.name AS career
      FROM learning_paths lp
      JOIN careers c ON c.id = lp.career_id
      WHERE lp.user_id = $1
        AND EXISTS (
          SELECT 1
          FROM learning_path_items lpi
          WHERE lpi.learning_path_id = lp.id
        )
      ORDER BY lp.created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    const { career_id: careerId, career } = pathResult.rows[0];

    // 2️⃣ TRUE progress calculation (ignore required_level = 0)
    const progressResult = await pool.query(
      `
      SELECT
        COUNT(cs.skill_id) AS total,

        COALESCE(SUM(us.level), 0) AS earned_levels,

        COUNT(cs.skill_id) * 3 AS max_levels,

        COALESCE(SUM(us.level), 0) * 100.0 /
        NULLIF(COUNT(cs.skill_id) * 3, 0) AS progress

      FROM career_skills cs
      LEFT JOIN user_skills us
        ON us.skill_id = cs.skill_id
      AND us.user_id = $1

      WHERE cs.career_id = $2
      `,
      [userId, careerId]
    );

    const totalSkills = Number(progressResult.rows[0].total || 0);
    const completedSkills = Math.floor(Number(progressResult.rows[0].earned_levels || 0) / 3);
    const progress = Math.round(progressResult.rows[0].progress || 0);


    // 3️⃣ Next unmet required skill
    const nextResult = await pool.query(
      `
      SELECT s.name
      FROM career_skills cs
      LEFT JOIN user_skills us
        ON us.skill_id = cs.skill_id AND us.user_id = $1
      JOIN skills s ON s.id = cs.skill_id
      WHERE cs.career_id = $2
        AND cs.required_level > 0
        AND COALESCE(us.level, 0) < cs.required_level
      ORDER BY cs.priority
      LIMIT 1
      `,
      [userId, careerId]
    );

    const nextSkill = nextResult.rows[0]?.name || null;

    return res.json({
      career,
      progress,
      nextSkill,
      totalSkills,
      completedSkills,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getDashboardHandler };
