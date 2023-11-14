"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogueRepository = void 0;
const Catalogue_1 = require("../models/Catalogue");
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const Sample_1 = require("../models/Sample");
const Winary_1 = require("../models/Winary");
const Wine_1 = require("../models/Wine");
const ResponseError_1 = require("../utils/ResponseError");
class CatalogueRepository {
    constructor() {
        this.getAllCatalogues = async () => {
            return await Catalogue_1.Catalogue.find();
        };
        this.getCatalogues = async (page, limit) => {
            const startIndex = (page - 1) * limit;
            return await Catalogue_1.Catalogue.find().limit(limit).skip(startIndex).exec();
        };
        this.getCatalogueByTitle = async (title) => {
            return await Catalogue_1.Catalogue.find({ title: { $regex: title, $options: "i" } });
        };
    }
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    async getCatalogueDetail(catalogueId) {
        const catalogue = await Catalogue_1.Catalogue.findById(catalogueId);
        if (catalogue == null) {
            throw new ResponseError_1.ResponseError("Catalogue not found", 404);
        }
        return catalogue;
    }
    async getCatalogueSamples(catalogueId) {
        return await Sample_1.Sample.find({
            catalogueId: catalogueId
        })
            .populate({
            path: "wineId",
            model: Wine_1.Wine,
            populate: [{
                    path: "winaryId",
                    model: Winary_1.Winary
                }, {
                    path: "grapeVarietals",
                    model: GrapeVarietal_1.GrapeVarietal
                }]
        });
    }
    async getCatalogueSampleDetail(id) {
        return await Sample_1.Sample.findById(id)
            .populate({
            path: "wineId",
            model: Wine_1.Wine,
            populate: [{
                    path: "winaryId",
                    model: Winary_1.Winary
                }, {
                    path: "grapeVarietals",
                    model: GrapeVarietal_1.GrapeVarietal
                }]
        });
    }
    async getParticipatedWineries(catalogueId) {
        // TODO CHANGE na particepated wineries entries
        const samplesResult = await Sample_1.Sample.find({ catalogueId: catalogueId });
        console.log(samplesResult);
        const wineIds = [];
        samplesResult.map(x => { wineIds.push(x.wineId.toString()); });
        const wineResults = await Wine_1.Wine.find().where("_id").in(wineIds);
        let wineriesIds = [];
        wineResults.map(x => { wineriesIds.push(x.winaryId.toString()); });
        wineriesIds = wineriesIds.filter(this.onlyUnique);
        return await Winary_1.Winary.find().where("_id").in(wineriesIds);
    }
}
exports.CatalogueRepository = CatalogueRepository;
