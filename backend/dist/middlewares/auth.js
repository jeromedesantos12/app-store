"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.nonAuth = nonAuth;
exports.isAdmin = isAdmin;
exports.isCustomer = isCustomer;
const jwt_1 = require("../utils/jwt");
const error_1 = require("../utils/error");
function auth(req, res, next) {
    const { token } = req.cookies;
    if (token === undefined) {
        throw (0, error_1.appError)("You must Login to access!", 401);
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    req.user = decoded;
    next();
}
function nonAuth(req, res, next) {
    const { token } = req.cookies;
    if (token) {
        throw (0, error_1.appError)("You're already logged in!", 400);
    }
    next();
}
function isAdmin(req, res, next) {
    const { role } = req.user;
    if (role !== "admin") {
        throw (0, error_1.appError)("Only admin can access this route!", 401);
    }
    next();
}
function isCustomer(req, res, next) {
    const { role } = req.user;
    if (role !== "customer") {
        throw (0, error_1.appError)("Only customer can access this route!", 401);
    }
    next();
}
