const {addSkillToCareerHandler, updateCareerSkillHandler, deleteCareerSkillHandler, getCareerRoadmapHandler} = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/requireAdmin');
const router = require('express').Router();

router.post('/add-skill', authMiddleware, adminMiddleware, addSkillToCareerHandler);
router.put('/update-skill/:id', authMiddleware, adminMiddleware, updateCareerSkillHandler);
router.delete('/delete-skill/:id', authMiddleware, adminMiddleware, deleteCareerSkillHandler);
router.get('/career/:careerId', getCareerRoadmapHandler);

module.exports = router;