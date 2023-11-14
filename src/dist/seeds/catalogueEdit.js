"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Catalogue_1 = require("../models/Catalogue");
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
    console.log('mongo connection open');
    await editCatalogues();
    // const ratedSample = new RatedSample({
    //     sampleId: "6407356bdb3d9a0c9f431280",
    //     commissionMemberId: "63c51ea82a3d2698643a323f",
    //     rating: 18
    // });
    // await ratedSample.save();
    console.log("done");
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
const editCatalogues = async () => {
    const res = await Catalogue_1.Catalogue.updateMany({}, { "published": true }).exec();
    console.log(res);
};
