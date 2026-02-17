const {
  createLearningPath,
  generateLearningPathItems,
  getLearningPathItems,
  getUserLearningPath,
  ensureUserSkillsForPath,
} = require("../db/queries");


// 🔹 Create + generate learning path
async function generateLearningPathHandler(req, res) {
  try {
    const { careerId } = req.body;
    const userId = req.user.id;

    if (!careerId) {
      return res.status(400).json({ message: "Career ID is required" });
    }

    // 1️⃣ create learning path
    const pathId = await createLearningPath(userId, careerId);

    // 2️⃣ generate items
    await generateLearningPathItems(pathId, userId, careerId);

    // 3️⃣ ensure items actually exist (CRITICAL)
    const items = await getLearningPathItems(pathId);

    if (!items.length) {
      return res.status(500).json({
        message: "Learning path generation failed — no items created",
      });
    }

    return res.status(201).json({
      message: "Learning path generated successfully",
      learningPathId: pathId,
    });
  } catch (err) {
    console.error("GENERATE PATH ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// 🔹 Get items by learning path ID
async function getLearningPathItemsHandler(req, res) {
  try {
    const { pathId } = req.params;

    const items = await getLearningPathItems(pathId);

    return res.json(items);
  } catch (err) {
    console.error("GET ITEMS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


// 🔥 Get current user's active learning path (LEVEL-SAFE)
async function getUserLearningPathHandler(req, res) {
  try {
    const userId = req.user.id;

    // 1️⃣ find latest learning path
    const path = await getUserLearningPath(userId);

    if (!path) {
      return res.json([]);
    }

    // 2️⃣ 🔥 guarantee user_skills rows exist
    await ensureUserSkillsForPath(userId, path.id);

    // 3️⃣ fetch items
    const items = await getLearningPathItems(path.id);

    return res.json(items);
  } catch (err) {
    console.error("GET USER LEARNING PATH ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
  generateLearningPathHandler,
  getLearningPathItemsHandler,
  getUserLearningPathHandler,
};
