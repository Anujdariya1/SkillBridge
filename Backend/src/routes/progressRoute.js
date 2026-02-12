const {markSkillCompletedHandler, getProgressPercentageHandler} = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.post('/complete', authMiddleware, markSkillCompletedHandler);
router.get('/percentage', authMiddleware, getProgressPercentageHandler);

module.exports = router;