"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WineRepository = void 0;
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const Winary_1 = require("../models/Winary");
const Wine_1 = require("../models/Wine");
class WineRepository {
    async getWines() {
        return await Wine_1.Wine.find({});
    }
    async getWineDetail(id) {
        return await Wine_1.Wine.findById(id).populate([{
                path: "winaryId",
                model: Winary_1.Winary
            }, {
                path: "grapeVarietals",
                model: GrapeVarietal_1.GrapeVarietal
            }]);
    }
    async getGrapeVarietals() {
        return await GrapeVarietal_1.GrapeVarietal.find({});
    }
}
exports.WineRepository = WineRepository;
