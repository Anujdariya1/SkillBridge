const {createCareer, getAllCareers, getCareerById, updateCareer, deleteCareer} = require('../controllers/careerController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/requireAdmin');
const router = require('express').Router();

router.post('/', authMiddleware, adminMiddleware, createCareer);
router.get('/', getAllCareers);
router.get('/:id', getCareerById);
router.put('/:id', authMiddleware, adminMiddleware, updateCareer);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCareer);

module.exports = router;