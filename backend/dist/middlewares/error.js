"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({
            status: "Error",
            message: "file bigger than 2 MB",
        });
        return;
    }
    console.log(err);
    res.status(err.statusCode || 500).json({
        status: err.name || "error",
        message: err.message || "Internal Server Error!",
    });
}
