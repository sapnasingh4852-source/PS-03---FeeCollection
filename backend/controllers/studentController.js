const User = require("../models/User.js");
const Payment = require("../models/Payment.js");
const { computeSummary } = require("../utils/helpers.js");

const studentController = {

    getStudents: async (req, res) => {
        const students = await User.find({ role: "student" }).select("-password");
        res.json(students);
    },

    getStudentFees: async (req, res) => {
        // admin can view any student, a student can view only his own fees
        if (req.user.role !== "admin" && req.user.id !== req.params.id) {
            return res.status(403).json({ message: "You can view only your own fees." });
        }

        const student = await User.findById(req.params.id).select("-password");
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const summary = await computeSummary(student);
        const payments = await Payment.find({ student: student._id }).sort({ date: -1 });

        res.json({ student, summary, payments });
    }

};

module.exports = studentController;
