"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const error_1 = require("../utils/error");
function validate(schema) {
    return function (req, res, next) {
        const { error } = schema.validate(req.body);
        if (error) {
            throw (0, error_1.appError)(error.message, 400);
        }
        next();
    };
}
