const {getTotalUsersHandler,
    getMostChosenCareersHandler}= require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
const router = require('express').Router();

router.get('/total-users', authMiddleware, getTotalUsersHandler);
router.get('/most-chosen-careers', authMiddleware, getMostChosenCareersHandler);

module.exports = router;