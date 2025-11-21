"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRoute = errorRoute;
const error_1 = require("../utils/error");
function errorRoute(req, res, next) {
    try {
        throw (0, error_1.appError)("Route Not Found!", 404);
    }
    catch (err) {
        next(err);
    }
}
exports.default = errorRoute;
