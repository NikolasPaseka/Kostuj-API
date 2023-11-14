"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinaryController = void 0;
const WinaryRepository_1 = require("../repositories/WinaryRepository");
class WinaryController {
    constructor() {
        this.winaryRepository = new WinaryRepository_1.WinaryRepository();
        this.getWinaries = async (req, res) => {
            const winaries = await this.winaryRepository.getWinaries();
            res.json(winaries);
        };
        this.getWineryDetail = async (req, res) => {
            const { id } = req.params;
            const winery = await this.winaryRepository.getWineryDetail(id);
            res.json(winery);
        };
    }
}
exports.WinaryController = WinaryController;
