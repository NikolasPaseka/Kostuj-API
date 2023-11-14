"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const Sample_1 = require("../models/Sample");
const Catalogue_1 = require("../models/Catalogue");
const Wine_1 = require("../models/Wine");
async function seedSamples() {
    var sampleMock = {
        name: { faker: "lorem.words(1)" },
        rating: { function: function () {
                return Math.floor(Math.random() * (20 - 5 + 1) + 5); //ranomd from 5 to 20
            } }
    };
    var data = (0, mocker_data_generator_1.default)()
        .schema('sampleMock', sampleMock, 1200)
        .buildSync();
    await seedData();
    async function seedData() {
        try {
            const catalogues = await Catalogue_1.Catalogue.find({});
            const wines = await Wine_1.Wine.find({});
            let catalogueIndex = 0;
            let wineIndex = 0;
            for (const sample of data.sampleMock) {
                sample.catalogueId = catalogues[catalogueIndex];
                sample.wineId = wines[wineIndex];
                const samp = new Sample_1.Sample(sample);
                samp.save();
                if (catalogueIndex >= catalogues.length - 1) {
                    catalogueIndex = 0;
                }
                else {
                    catalogueIndex++;
                }
                if (wineIndex >= wines.length - 1) {
                    wineIndex = 0;
                }
                else {
                    wineIndex++;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        console.log("done");
        //mongoose.connection.close()
    }
}
exports.default = seedSamples;
