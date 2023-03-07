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
const mongoose_1 = __importDefault(require("mongoose"));
const catalogue_1 = require("../models/catalogue");
const RatedSample_1 = require("../models/RatedSample");
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('mongo connection open');
    //await editCatalogues();
    const ratedSample = new RatedSample_1.RatedSample({
        sampleId: "6407356bdb3d9a0c9f431280",
        commissionMemberId: "63c51ea82a3d2698643a323f",
        rating: 18
    });
    yield ratedSample.save();
    console.log("done");
}))
    .catch((err) => {
    console.log(`err: ${err}`);
});
const editCatalogues = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield catalogue_1.Catalogue.updateMany({}, { "published": true }).exec();
    console.log(res);
});
