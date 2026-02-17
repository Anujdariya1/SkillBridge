const {createCareerHandler, getAllCareersHandler, getCareerByIdHandler, updateCareerHandler, deleteCareerHandler} = require('../controllers/careerController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/requireAdmin');
const router = require('express').Router();

router.post('/', authMiddleware, adminMiddleware, createCareerHandler);
router.get('/', getAllCareersHandler);
router.get('/:id', getCareerByIdHandler);
router.put('/:id', authMiddleware, adminMiddleware, updateCareerHandler);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCareerHandler);

module.exports = router;