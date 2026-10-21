const express = require("express");
const router = express.Router();

const { authHandler, adminOnly } = require("../middleware/authHandler.js");
const paymentController = require("../controllers/paymentController.js");

router.post("/", authHandler, adminOnly, paymentController.createPayment);

router.get("/receipt/:receiptNo", authHandler, paymentController.getReceipt);

module.exports = router;
