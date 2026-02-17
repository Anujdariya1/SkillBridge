const {generateLearningPathHandler, getLearningPathItemsHandler, getUserLearningPathHandler} = require('../controllers/learningpathController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('learning path route works');
});

router.post("/", authMiddleware, generateLearningPathHandler);
router.get("/user", authMiddleware, getUserLearningPathHandler);
router.get("/:pathId", authMiddleware, getLearningPathItemsHandler);


module.exports = router;