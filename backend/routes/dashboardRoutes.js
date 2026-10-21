const express = require("express");
const router = express.Router();

const { authHandler, adminOnly } = require("../middleware/authHandler.js");
const dashboardController = require("../controllers/dashboardController.js");

router.get("/", authHandler, adminOnly, dashboardController.getDashboard);

module.exports = router;
