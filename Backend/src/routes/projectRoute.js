const {addProjectHandler, getProjectsBySkillHandler, submitProjectHandler, getUserSubmissionsHandler} = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.post('/', authMiddleware, addProjectHandler);
router.get('/skill/:skillId', getProjectsBySkillHandler);
router.post('/:projectId/submit', authMiddleware, submitProjectHandler);
router.get('/submissions', authMiddleware, getUserSubmissionsHandler);

module.exports = router;