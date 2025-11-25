"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = appError;
function appError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}
