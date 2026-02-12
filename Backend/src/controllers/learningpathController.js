const {createLearningPath, generateLearningPathItems, getLearningPathItems} = require('../db/queries');

async function generateLearningPathHandler(req, res) {
  try {
    const { careerId } = req.body;
    const userId = req.user.id;

    if (!careerId) {
      return res.status(400).json({ message: 'Career ID is required' });
    }

    // 1. create learning path
    const pathId = await createLearningPath(userId, careerId);

    // 2. generate gap-based items
    await generateLearningPathItems(pathId, userId, careerId);

    return res.status(201).json({
      message: 'Learning path generated successfully',
      learningPathId: pathId
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getLearningPathItemsHandler(req, res) {
  try {
    const { pathId } = req.params;

    const items = await getLearningPathItems(pathId);

    return res.json(items);

  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  generateLearningPathHandler,
  getLearningPathItemsHandler
};