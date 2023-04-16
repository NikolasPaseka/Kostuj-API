"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log(`error ${err.message}`);
    next();
    const statusCode = err.statusCode || 400;
    res.statusCode = statusCode;
    res.json({
        "error": err.message
    });
};
exports.errorHandler = errorHandler;
