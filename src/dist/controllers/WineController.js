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
exports.WineController = void 0;
const WineRepository_1 = require("../repositories/WineRepository");
const ResponseError_1 = require("../utils/ResponseError");
class WineController {
    constructor() {
        this.wineRepository = new WineRepository_1.WineRepository();
        this.getWines = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wines = yield this.wineRepository.getWines();
            res.json(wines);
        });
        this.getWineDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const wine = yield this.wineRepository.getWineDetail(id);
            if (wine == null) {
                throw new ResponseError_1.ResponseError("Wine does not found", 404);
            }
            res.json(wine);
        });
        this.getGrapeVarietals = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const grapeVarietals = yield this.wineRepository.getGrapeVarietals();
            res.json(grapeVarietals);
        });
    }
}
exports.WineController = WineController;
