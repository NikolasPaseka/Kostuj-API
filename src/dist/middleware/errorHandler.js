"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorHandler = function (err, req, res, next) {
    console.log("error ".concat(err.message));
    next();
    var statusCode = err.statusCode || 400;
    res.statusCode = statusCode;
    res.json({
        "error": err.message
    });
};
exports.errorHandler = errorHandler;
