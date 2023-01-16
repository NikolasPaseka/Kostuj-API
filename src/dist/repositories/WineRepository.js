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
exports.WineRepository = void 0;
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const winary_1 = require("../models/winary");
const wine_1 = require("../models/wine");
class WineRepository {
    getWines() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wine_1.Wine.find({});
        });
    }
    getWineDetail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield wine_1.Wine.findById(id).populate([{
                    path: "winaryId",
                    model: winary_1.Winary
                }, {
                    path: "grapeVarietals",
                    model: GrapeVarietal_1.GrapeVarietal
                }]);
        });
    }
    getGrapeVarietals() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield GrapeVarietal_1.GrapeVarietal.find({});
        });
    }
}
exports.WineRepository = WineRepository;
