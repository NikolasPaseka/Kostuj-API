"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Catalogue_1 = require("../models/Catalogue");
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@main.c4cc4mc.mongodb.net/dev?retryWrites=true&w=majority')
    .then(async () => {
    console.log('mongo connection open');
    await editCatalogues();
    console.log("done");
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
const editCatalogues = async () => {
    const res = await Catalogue_1.Catalogue.updateMany({}, {
        "published": true,
        "maxWineRating": 20
    }).exec();
    console.log(res);
};
