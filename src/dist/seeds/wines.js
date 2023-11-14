"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
const faker_1 = require("@faker-js/faker");
const mongoose_1 = __importDefault(require("mongoose"));
const Winary_1 = require("../models/Winary");
const Wine_1 = require("../models/Wine");
const GrapeVarietal_1 = require("../models/GrapeVarietal");
function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var sampleMock = {
    name: { faker: "lorem.words(2)" },
    color: { function: function () {
            const arr = ['red', 'white', 'rose'];
            return arr[Math.floor(Math.random() * arr.length)];
        } },
    year: { function: function () {
            let number = Math.floor(Math.random() * (2022 - 2010 + 1) + 2010);
            return number;
        } },
    description: { function: function () {
            return faker_1.faker.lorem.sentences(2);
        } },
    residualSugar: { function: function () {
            return getRandomNumber(0, 60);
        } },
    alcoholContent: { function: function () {
            return getRandomFloat(0.10, 0.14, 2);
        } },
    acidity: { function: function () {
            return getRandomFloat(4, 10, 1);
        } },
    grapesSweetness: { function: function () {
            return getRandomNumber(11, 32);
        } },
    imageUrl: { function: function () {
            return faker_1.faker.image.imageUrl(1234, 2345, 'wine', true);
        } }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 300)
    .buildSync();
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
    console.log('mongo connection open');
    seedData();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
async function seedData() {
    try {
        await Wine_1.Wine.collection.drop();
        const winaries = await Winary_1.Winary.find({});
        const grapeVarietals = await GrapeVarietal_1.GrapeVarietal.find();
        let index = 0;
        for (const sample of data.sampleMock) {
            sample.winaryId = winaries[index];
            const samp = new Wine_1.Wine(sample);
            if (getRandomFloat(0, 1, 2) < 0.8) {
                const rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                samp.grapeVarietals.push(rand);
            }
            else {
                const max = 3;
                const min = 2;
                const randNumberOfGrapes = Math.floor(Math.random() * (max - min) + min);
                for (let i = 0; i < randNumberOfGrapes; i++) {
                    const rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                    samp.grapeVarietals.push(rand);
                }
            }
            await samp.save();
            if (index >= winaries.length - 1) {
                index = 0;
            }
            else {
                index++;
            }
        }
    }
    catch (e) {
        console.log(e);
    }
    console.log("done lol");
    //mongoose.connection.close()
}
