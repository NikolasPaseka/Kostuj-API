"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function catchAsync(func) {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
}
exports.default = catchAsync;
