"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const catalogue_1 = require("../models/catalogue");
var sampleMock = {
    title: { faker: "lorem.words(1)" },
    description: { faker: "lorem.sentences(5)" },
    year: { function: function () {
            return Math.floor(Math.random() * (2023 - 2017) + 2017);
        }
    },
    startDate: { function: function () {
            return Math.floor(Date.now() / 1000);
        } },
    address: { faker: "address.streetName" },
    location: {
        latitude: { faker: "address.latitude" },
        longitude: { faker: "address.longitude" }
    },
    imageUrl: { faker: "image.nightlife(400,800,true)" }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 30)
    .buildSync();
mongoose_1.default.connect('mongodb://localhost:27017/kostuj')
    .then(() => {
    console.log('mongo connection open');
    catalogue_1.Catalogue.collection.drop();
    seedData();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
function seedData() {
    for (const catalogue of data.sampleMock) {
        try {
            const cat = new catalogue_1.Catalogue(catalogue);
            cat.save();
        }
        catch (err) {
            console.log(err);
        }
    }
    console.log("done");
    //mongoose.connection.close()
}
