"use strict";
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
                    object["imageUrl"] = object["imageUrl"][0];
                    delete object["title"];
                }
                delete object["_id"];
                delete object["__v"];
                locationObjects.push(object);
            }
            return locationObjects;
        };
        this.getAllLocations = async (req, res) => {
            const catalogues = await this.catalogueRepository.getAllCatalogues();
            const winaries = await this.winaryRepository.getWinaries();
            const resultArray = [...this.getLocationWithTypes(catalogues, "feast"), ...this.getLocationWithTypes(winaries, "winery")];
            res.json(resultArray);
        };
    }
}
exports.MapLocationController = MapLocationController;
