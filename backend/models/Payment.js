const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    mode: { type: String, enum: ["Cash", "UPI", "Card"] },
    date: { type: Date, default: Date.now },
    transactionRef: String,
    receiptNo: { type: String, unique: true }
});

module.exports = mongoose.model("Payment", paymentSchema);
