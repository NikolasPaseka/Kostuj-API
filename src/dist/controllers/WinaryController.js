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
exports.WinaryController = void 0;
const WinaryRepository_1 = require("../repositories/WinaryRepository");
class WinaryController {
    constructor() {
        this.winaryRepository = new WinaryRepository_1.WinaryRepository();
        this.getWinaries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const winaries = yield this.winaryRepository.getWinaries();
            res.json(winaries);
        });
        this.getWineryDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const winery = yield this.winaryRepository.getWineryDetail(id);
            res.json(winery);
        });
    }
}
exports.WinaryController = WinaryController;
