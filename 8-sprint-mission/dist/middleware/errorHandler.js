"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.log("error:", err);
    const status = err.status || 500;
    const message = err.message || "서버 오류";
    res.status(status).json({ success: false, message });
}
