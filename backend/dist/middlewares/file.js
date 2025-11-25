"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFile = isFile;
exports.saveFile = saveFile;
const mime_types_1 = require("mime-types");
const error_1 = require("../utils/error");
function isFile(req, res, next) {
    if (req.file === undefined) {
        throw (0, error_1.appError)("No file uploaded", 400);
    }
    next();
}
function saveFile(req, res, next) {
    const file = req.file;
    if (file) {
        const fieldName = file.fieldname;
        const ext = (0, mime_types_1.extension)(file.mimetype);
        const uniqueSuffix = Date.now() + `-` + Math.round(Math.random() * 1e9);
        const fileName = fieldName + "-" + uniqueSuffix + "." + ext;
        const fileBuffer = file.buffer;
        req.processedFile = {
            fileName,
            fileBuffer,
        };
    }
    next();
}
