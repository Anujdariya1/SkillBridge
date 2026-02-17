const router = require("express").Router();
const authMiddleware = require("../middleware/auth");
const { getDashboardHandler } = require("../controllers/dashboardController");

router.get("/", authMiddleware, getDashboardHandler);

module.exports = router;
