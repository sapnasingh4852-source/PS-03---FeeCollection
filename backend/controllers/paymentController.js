const Payment = require("../models/Payment.js");
const User = require("../models/User.js");
const { computeSummary, generateReceiptNo } = require("../utils/helpers.js");

const MODES = ["Cash", "UPI", "Card"];

const paymentController = {

    createPayment: async (req, res) => {
        const { studentId, amount, mode, date, transactionRef } = req.body;

        const student = await User.findOne({ _id: studentId, role: "student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        if (!MODES.includes(mode)) {
            return res.status(400).json({ message: "Mode must be Cash, UPI or Card." });
        }

        const paidAmount = Number(amount);

        // zero, negative or more than the pending amount is rejected
        if (!paidAmount || paidAmount <= 0) {
            return res.status(400).json({ message: "Payment amount must be greater than zero." });
        }

        const summary = await computeSummary(student);
        if (paidAmount > summary.pending) {
            return res.status(400).json({ message: `Amount is more than the pending fee (Rs. ${summary.pending}).` });
        }

        const payment = await Payment.create({
            student: student._id,
            amount: paidAmount,
            mode,
            date: date || Date.now(),
            transactionRef,
            receiptNo: await generateReceiptNo()
        });

        res.status(201).json(payment);
    },

    getReceipt: async (req, res) => {
        const payment = await Payment.findOne({ receiptNo: req.params.receiptNo }).populate("student", "name rollNo course email");

        if (!payment) {
            return res.status(404).json({ message: "Receipt not found." });
        }

        // admin can view every receipt, a student only his own
        if (req.user.role !== "admin" && String(payment.student._id) !== req.user.id) {
            return res.status(403).json({ message: "You can view only your own receipts." });
        }

        res.json(payment);
    }

};

module.exports = paymentController;
