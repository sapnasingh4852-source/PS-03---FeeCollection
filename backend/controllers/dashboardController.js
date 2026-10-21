const User = require("../models/User.js");
const Payment = require("../models/Payment.js");
const { computeSummary } = require("../utils/helpers.js");

const dashboardController = {

    getDashboard: async (req, res) => {
        const payments = await Payment.find().populate("student", "name rollNo course");
        const students = await User.find({ role: "student" });

        const totalCollected = payments.reduce((sum, payment) => sum + payment.amount, 0);

        const modeWise = {};
        payments.forEach((payment) => {
            modeWise[payment.mode] = (modeWise[payment.mode] || 0) + payment.amount;
        });

        let totalPending = 0;
        const defaulters = [];
        const studentSummaries = [];

        for (const student of students) {
            const summary = await computeSummary(student);
            totalPending += summary.pending;
            studentSummaries.push({ student, summary });

            if (summary.pending > 0 && summary.overdue) {
                defaulters.push({ student, pending: summary.pending });
            }
        }

        res.json({ totalCollected, totalPending, modeWise, defaulters, students: studentSummaries });
    }

};

module.exports = dashboardController;
