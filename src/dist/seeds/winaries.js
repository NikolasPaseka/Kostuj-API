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
const winary_1 = require("../models/winary");
const faker_1 = require("@faker-js/faker");
function getRandomCoordinationInRange(from, to, fixed) {
    return parseFloat((Math.random() * (to - from) + from).toFixed(fixed)) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
var sampleMock = {
    name: { function: function () {
            return faker_1.faker.company.name();
        } },
    address: { faker: "address.streetAddress" },
    imageUrl: { function: function () {
            return faker_1.faker.image.imageUrl(1920, 1080, 'winery', true);
        } },
    description: { function: function () {
            return faker_1.faker.lorem.sentences(2);
        } },
    phoneNumber: { function: function () {
            return faker_1.faker.phone.number();
        } },
    email: { function: function () {
            return faker_1.faker.internet.email();
        } },
    websitesUrl: { function: function () {
            return faker_1.faker.internet.domainName();
        } },
    location: {
        // latitude: { faker: "address.latitude" },
        // longitude: { faker: "address.longitude" }
        latitude: { function: function () {
                return getRandomCoordinationInRange(49.624519, 49.976907, 6);
            } },
        longitude: { function: function () {
                return getRandomCoordinationInRange(16.696000, 15.179145, 6);
            } }
    }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 8)
    .buildSync();
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
    console.log('mongo connection open');
    winary_1.Winary.collection.drop();
    seedData();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const winary of data.sampleMock) {
                const win = new winary_1.Winary(winary);
                yield win.save();
            }
            console.log(data.sampleMock);
        }
        catch (e) {
            console.log(e);
        }
        console.log("done");
        //mongoose.connection.close()
    });
}
