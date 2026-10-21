const mongoose = require("mongoose");

const feeStructureSchema = new mongoose.Schema({
    course: String,
    feeHead: String,
    amount: Number,
    dueDate: Date,
    lateFeePerDay: { type: Number, default: 0 }
});

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
