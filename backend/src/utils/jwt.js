const jwt = require("jsonwebtoken");

const EXPIRES_IN = "2h";

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
