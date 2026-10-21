const express = require("express");
const router = express.Router();

const { authHandler, adminOnly } = require("../middleware/authHandler.js");
const studentController = require("../controllers/studentController.js");

router.get("/", authHandler, adminOnly, studentController.getStudents);

router.get("/:id/fees", authHandler, studentController.getStudentFees);

module.exports = router;
