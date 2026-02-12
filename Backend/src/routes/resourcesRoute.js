const {addResourceHandler, getResourcesBySkillHandler} = require('../controllers/resourceController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.post('/', authMiddleware, addResourceHandler);
router.get('/skill/:skillId', getResourcesBySkillHandler);

module.exports = router;