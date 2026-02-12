const {createSkillHandler, updateSkillHandler, deleteSkillHandler, getAllSkillsHandler} = require('../controllers/skillController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/requireAdmin');
const router = require('express').Router();

router.post('/', authMiddleware, adminMiddleware, createSkillHandler);
router.get('/', getAllSkillsHandler);
router.put('/:id', authMiddleware, adminMiddleware, updateSkillHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteSkillHandler);

module.exports = router;