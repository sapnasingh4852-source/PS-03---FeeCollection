const FeeStructure = require("../models/FeeStructure.js");
const Payment = require("../models/Payment.js");

const DAY = 1000 * 60 * 60 * 24;

// total payable = all fee heads of the student's course + late fee,
// paid = sum of all payments, pending = payable - paid
const computeSummary = async (student) => {
    const feeStructures = await FeeStructure.find({ course: student.course });

    const today = new Date();
    let lateFee = 0;
    let overdue = false;

    const fees = feeStructures.reduce((sum, fee) => {
        const dueDate = new Date(fee.dueDate);

        if (dueDate < today) {
            overdue = true;
            const daysLate = Math.floor((today - dueDate) / DAY);
            lateFee += (fee.lateFeePerDay || 0) * daysLate;
        }

        return sum + fee.amount;
    }, 0);

    const payments = await Payment.find({ student: student._id });
    const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const payable = fees + lateFee;
    const pending = payable - paid;

    let status = "Unpaid";
    if (pending <= 0 && paid > 0) {
        status = "Paid";
    } else if (paid > 0) {
        status = "Partially Paid";
    }

    return { payable, lateFee, paid, pending, status, overdue };
};

// RCP-2026-0001, RCP-2026-0002, ... one number for every payment
const generateReceiptNo = async () => {
    const year = new Date().getFullYear();
    const count = await Payment.countDocuments({ receiptNo: { $regex: `^RCP-${year}-` } });

    return `RCP-${year}-${String(count + 1).padStart(4, "0")}`;
};

module.exports = { computeSummary, generateReceiptNo };
