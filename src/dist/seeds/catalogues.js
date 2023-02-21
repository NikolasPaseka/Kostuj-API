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
const faker_1 = require("@faker-js/faker");
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const catalogue_1 = require("../models/catalogue");
const sample_1 = require("../models/sample");
const samples_1 = __importDefault(require("./samples"));
const followedCatalogues_1 = require("../models/followedCatalogues");
const favoriteWine_1 = require("../models/favoriteWine");
const FavoriteWinery_1 = require("../models/FavoriteWinery");
function getRandomCoordinationInRange(from, to, fixed) {
    return parseFloat((Math.random() * (to - from) + from).toFixed(fixed)) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
var sampleMock = {
    title: { faker: "lorem.words(2)" },
    description: { faker: "lorem.sentences(5)" },
    year: { function: function () {
            return Math.floor(Math.random() * (8 - 1) + 1);
        }
    },
    startDate: { function: function () {
            return faker_1.faker.date.between(1673813369, 1681589369);
        } },
    address: { faker: "address.streetName" },
    location: {
        latitude: { function: function () {
                return getRandomCoordinationInRange(49.624519, 49.976907, 6);
            } },
        longitude: { function: function () {
                return getRandomCoordinationInRange(16.696000, 15.179145, 6);
            } }
    },
    imageUrl: { function: function () {
            return faker_1.faker.image.imageUrl(1234, 2345, "wine", true);
        } }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 30)
    .buildSync();
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('mongo connection open');
    // transformSchemasToClient();
    yield followedCatalogues_1.FollowedCatalogue.collection.drop();
    yield favoriteWine_1.FavoriteWine.collection.drop();
    yield FavoriteWinery_1.FavoriteWinery.collection.drop();
    yield catalogue_1.Catalogue.collection.drop();
    yield seedData();
    yield sample_1.Sample.collection.drop();
    yield (0, samples_1.default)();
}))
    .catch((err) => {
    console.log(`err: ${err}`);
});
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const catalogue of data.sampleMock) {
            try {
                const cat = new catalogue_1.Catalogue(catalogue);
                yield cat.save();
            }
            catch (err) {
                console.log(err);
            }
        }
        console.log("done");
        //mongoose.connection.close()
    });
}
