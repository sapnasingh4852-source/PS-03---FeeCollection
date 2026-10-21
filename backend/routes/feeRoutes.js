const express = require("express");
const router = express.Router();

const { authHandler, adminOnly } = require("../middleware/authHandler.js");
const feeController = require("../controllers/feeController.js");

// fee structures are managed by admin only
router.use(authHandler, adminOnly);

router.get("/", feeController.getFees);

router.post("/", feeController.createFee);

router.put("/:id", feeController.updateFee);

router.delete("/:id", feeController.deleteFee);

module.exports = router;
