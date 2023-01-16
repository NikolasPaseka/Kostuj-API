"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.log(`error ${err.message}`);
    const statusCode = err.statusCode || 400;
    res.statusMessage = err.message;
    res.statusCode = statusCode;
    res.end();
};
exports.errorHandler = errorHandler;
