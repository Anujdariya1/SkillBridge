const { updateUserSkillLevel } = require("../db/queries");

async function updateSkillLevelHandler(req, res) {
  try {
    const userId = req.user.id;
    const { skillId } = req.params;
    const { level } = req.body;

    if (level < 0 || level > 3) {
      return res.status(400).json({ message: "Invalid level" });
    }

    const updated = await updateUserSkillLevel(userId, skillId, level);

    if (!updated) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error("UPDATE LEVEL ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { updateSkillLevelHandler };
