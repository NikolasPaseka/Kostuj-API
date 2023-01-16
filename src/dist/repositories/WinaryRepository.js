"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinaryRepository = void 0;
const winary_1 = require("../models/winary");
const ResponseError_1 = require("../utils/ResponseError");
class WinaryRepository {
    getWinaries() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield winary_1.Winary.find({});
        });
    }
    getWineryDetail(wineryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const winery = yield winary_1.Winary.findById(wineryId);
            if (winery == null) {
                throw new ResponseError_1.ResponseError("Catalogue not found", 404);
            }
            return winery;
        });
    }
}
exports.WinaryRepository = WinaryRepository;
