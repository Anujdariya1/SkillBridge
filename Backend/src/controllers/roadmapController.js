const {addSkillToCareer, updateCareerSkill, deleteCareerSkill, getCareerRoadmap} = require('../db/queries');

async function addSkillToCareerHandler(req, res) {
  try {
    const { careerId, skillId, level } = req.body;
    if (!careerId || !skillId || !level) {
      return res.status(400).json({ message: 'Career ID, Skill ID and Level are required' });
    }
    await addSkillToCareer(careerId, skillId, level);
    return res.status(201).json({ message: 'Skill added to career successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateCareerSkillHandler(req, res) {
  try {
    const { careerId, skillId, level } = req.body;
    if (!careerId || !skillId || !level) {
      return res.status(400).json({ message: 'Career ID, Skill ID and Level are required' });
    }
    await updateCareerSkill(careerId, skillId, level);
    return res.json({ message: 'Career skill updated successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteCareerSkillHandler(req, res) {
  try {
    const { careerId, skillId } = req.body;
    if (!careerId || !skillId) {
      return res.status(400).json({ message: 'Career ID and Skill ID are required' });
    }
    await deleteCareerSkill(careerId, skillId);
    return res.json({ message: 'Career skill deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getCareerRoadmapHandler(req, res) {
    try {
        const { careerId } = req.params;
        const roadmap = await getCareerRoadmap(careerId);
        return res.json(roadmap);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = {
  addSkillToCareerHandler,
  updateCareerSkillHandler,
  deleteCareerSkillHandler,
  getCareerRoadmapHandler
};