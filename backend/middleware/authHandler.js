const jwt = require("jsonwebtoken");

const authHandler = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Please login first." });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: "Session expired. Please login again." });
    }

    next();
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admin can access this." });
    }

    next();
};

module.exports = { authHandler, adminOnly };
