const {getTotalUsersHandler, getMostChosenCareersHandler, createCareerHandler, createSkillHandler, mapSkillToCareerHandler}= require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.get('/total-users', authMiddleware, getTotalUsersHandler);
router.get('/most-chosen-careers', authMiddleware, getMostChosenCareersHandler);
router.post('/careers', authMiddleware, createCareerHandler);
router.post('/skills', authMiddleware, createSkillHandler);
router.post('/career-skills', authMiddleware, mapSkillToCareerHandler);


module.exports = router;