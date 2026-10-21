const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const makeToken = (user) => {
    return jwt.sign(
        { id: user._id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const safeUser = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNo: user.rollNo,
        course: user.course
    };
};

const authController = {

    register: async (req, res) => {
        const { name, email, password, role, rollNo, course } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const user = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            role: role === "admin" ? "admin" : "student",
            rollNo: role === "admin" ? undefined : rollNo,
            course: role === "admin" ? undefined : course
        });

        res.status(201).json({ token: makeToken(user), user: safeUser(user) });
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({ token: makeToken(user), user: safeUser(user) });
    }

};

module.exports = authController;
