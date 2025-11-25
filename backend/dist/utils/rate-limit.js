"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const error_1 = require("./error");
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    handler: (req, res, next) => {
        next((0, error_1.appError)("too many request, please try again later", 429));
    },
});
