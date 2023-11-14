"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const Catalogue_1 = require("../models/Catalogue");
const Sample_1 = require("../models/Sample");
const samples_1 = __importDefault(require("./samples"));
const CommissionMember_1 = require("../models/CommissionMember");
const RatedSample_1 = require("../models/RatedSample");
const User_1 = require("../models/User");
function getRandomCoordinationInRange(from, to, fixed) {
    return parseFloat((Math.random() * (to - from) + from).toFixed(fixed)) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var sampleMock = {
    title: { faker: "lorem.words(2)" },
    description: { faker: "lorem.sentences(5)" },
    year: { function: function () {
            return getRandomNumber(1, 8);
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
            const images = [];
            for (let i = 0; i < getRandomNumber(2, 5); i++) {
                images.push(faker_1.faker.image.imageUrl(1234, 2345, "wine", true));
            }
            return images;
        } }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 30)
    .buildSync();
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(async () => {
    console.log('mongo connection open');
    //transformSchemasToClient();
    await Catalogue_1.Catalogue.collection.drop();
    await seedData();
    await Sample_1.Sample.collection.drop();
    await (0, samples_1.default)();
    await CommissionMember_1.CommissionMember.collection.drop();
    await RatedSample_1.RatedSample.collection.drop();
    await seedCommission();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
async function seedData() {
    for (const catalogue of data.sampleMock) {
        try {
            const cat = new Catalogue_1.Catalogue(catalogue);
            await cat.save();
        }
        catch (err) {
            console.log(err);
        }
    }
    console.log("done");
    //mongoose.connection.close()
}
async function seedCommission() {
    const users = await User_1.User.find({});
    const catalogues = await Catalogue_1.Catalogue.find({});
    for (const user of users) {
        const numberToSeed = getRandomNumber(1, 3);
        for (let i = 0; i < numberToSeed; i++) {
            const randomCatalogue = catalogues[Math.floor(Math.random() * catalogues.length)];
            try {
                const commissionMember = new CommissionMember_1.CommissionMember({
                    catalogueId: randomCatalogue.id,
                    userId: user.id
                });
                await commissionMember.save();
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    console.log("commission seeded");
}
