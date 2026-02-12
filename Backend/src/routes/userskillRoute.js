const {upsertUserSkillHandler, getUserSkillsHandler}= require('../controllers/userskillController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.post('/', authMiddleware, upsertUserSkillHandler);
router.get('/', authMiddleware, getUserSkillsHandler);

module.exports = router;