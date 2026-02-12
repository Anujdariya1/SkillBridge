const {generateLearningPathHandler, getLearningPathItemsHandler} = require('../controllers/learningpathController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.post('/', authMiddleware, generateLearningPathHandler);
router.get('/:careerId', authMiddleware, getLearningPathItemsHandler);

module.exports = router;