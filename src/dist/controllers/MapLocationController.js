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
exports.MapLocationController = void 0;
const CatalogueRepository_1 = require("../repositories/CatalogueRepository");
const WinaryRepository_1 = require("../repositories/WinaryRepository");
class MapLocationController {
    constructor() {
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.winaryRepository = new WinaryRepository_1.WinaryRepository();
        this.getLocationWithTypes = (locations, locationType) => {
            const locationObjects = [];
            for (const location of locations) {
                const object = location.toObject({ getters: true });
                object["locationType"] = locationType;
                if (object["title"] != null) {
                    object["name"] = object["title"];
                    delete object["title"];
                }
                delete object["_id"];
                delete object["__v"];
                locationObjects.push(object);
            }
            return locationObjects;
        };
        this.getAllLocations = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const catalogues = yield this.catalogueRepository.getCatalogues();
            const winaries = yield this.winaryRepository.getWinaries();
            const resultArray = [...this.getLocationWithTypes(catalogues, "feast"), ...this.getLocationWithTypes(winaries, "winery")];
            res.json(resultArray);
        });
    }
}
exports.MapLocationController = MapLocationController;
