const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const { updateSkillLevelHandler } = require("../controllers/progressController");

router.patch("/:skillId/level", authMiddleware, updateSkillLevelHandler);

module.exports = router;
