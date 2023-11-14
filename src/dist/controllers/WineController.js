"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WineController = void 0;
const WineRepository_1 = require("../repositories/WineRepository");
const ResponseError_1 = require("../utils/ResponseError");
class WineController {
    constructor() {
        this.wineRepository = new WineRepository_1.WineRepository();
        this.getWines = async (req, res) => {
            const wines = await this.wineRepository.getWines();
            res.json(wines);
        };
        this.getWineDetail = async (req, res) => {
            const { id } = req.params;
            const wine = await this.wineRepository.getWineDetail(id);
            if (wine == null) {
                throw new ResponseError_1.ResponseError("Wine does not found", 404);
            }
            res.json(wine);
        };
        this.getGrapeVarietals = async (req, res) => {
            const grapeVarietals = await this.wineRepository.getGrapeVarietals();
            res.json(grapeVarietals);
        };
    }
}
exports.WineController = WineController;
