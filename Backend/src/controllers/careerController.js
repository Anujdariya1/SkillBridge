const {createCareer, updateCareer, deleteCareer, getAllCareers, getCareerById} = require('../db/queries');

async function createCareerHandler(req, res) {
    try {
        // Validate input
        if (!req.body.title || !req.body.description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        const { title, description } = req.body;
        const career = await createCareer(title, description);
        res.status(201).json(career);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function updateCareerHandler(req, res) {
    try {
        // Validate input
        if (!req.body.title || !req.body.description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        const { id } = req.params;
        const { title, description } = req.body;
        await updateCareer(id, title, description);
        res.json({ message: 'Career updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function deleteCareerHandler(req, res) {
    try {
        const { id } = req.params;
        await deleteCareer(id);
        res.json({ message: 'Career deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function getAllCareersHandler(req, res) {
    try {
        const careers = await getAllCareers();
        res.json(careers);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

async function getCareerByIdHandler(req, res) {
    try {
        const { id } = req.params;
        const career = await getCareerById(id);
        if (!career) {
            return res.status(404).json({ message: 'Career not found' });
        }
        res.json(career);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createCareerHandler,
    updateCareerHandler,
    deleteCareerHandler,
    getAllCareersHandler,
    getCareerByIdHandler
};