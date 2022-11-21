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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const mongoose_1 = __importDefault(require("mongoose"));
const sample_1 = require("../models/sample");
const catalogue_1 = require("../models/catalogue");
const wine_1 = require("../models/wine");
var sampleMock = {
    name: { faker: "lorem.words(1)" },
    rating: { function: function () {
            return Math.random() * (20 - 3) + 3;
        } }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 1200)
    .buildSync();
mongoose_1.default.connect('mongodb://localhost:27017/kostuj')
    .then(() => {
    console.log('mongo connection open');
    sample_1.Sample.collection.drop();
    seedData();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const catalogues = yield catalogue_1.Catalogue.find({});
            const wines = yield wine_1.Wine.find({});
            let catalogueIndex = 0;
            let wineIndex = 0;
            for (const sample of data.sampleMock) {
                sample.catalogueId = catalogues[catalogueIndex];
                sample.wineId = wines[wineIndex];
                const samp = new sample_1.Sample(sample);
                samp.save();
                if (catalogueIndex >= catalogues.length) {
                    catalogueIndex = 0;
                }
                else {
                    catalogueIndex++;
                }
                if (wineIndex >= wines.length) {
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
    });
}
