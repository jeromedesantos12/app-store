"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const error_1 = require("../utils/error");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = (0, path_1.extname)(file.originalname);
        if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
            return cb((0, error_1.appError)("Invalid file type: must jpg, jpeg, & png,", 400));
        }
        cb(null, true);
    },
});
