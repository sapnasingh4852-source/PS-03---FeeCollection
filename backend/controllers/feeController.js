const FeeStructure = require("../models/FeeStructure.js");

const feeController = {

    getFees: async (req, res) => {
        const feeStructures = await FeeStructure.find().sort({ course: 1 });
        res.json(feeStructures);
    },

    createFee: async (req, res) => {
        const feeStructure = await FeeStructure.create(req.body);
        res.status(201).json(feeStructure);
    },

    updateFee: async (req, res) => {
        const feeStructure = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });

        res.json(feeStructure);
    },

    deleteFee: async (req, res) => {
        await FeeStructure.findByIdAndDelete(req.params.id);
        res.json({ message: "Fee structure deleted." });
    }

};

module.exports = feeController;
