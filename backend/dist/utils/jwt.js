"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const JWT_SECRET = process.env.JWT_SECRET;
function signToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, JWT_SECRET, { expiresIn: "1d" });
}
function verifyToken(token) {
    return (0, jsonwebtoken_1.verify)(token, JWT_SECRET);
}
