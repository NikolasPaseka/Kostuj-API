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
const faker_1 = require("@faker-js/faker");
const mongoose_1 = __importDefault(require("mongoose"));
const winary_1 = require("../models/winary");
const wine_1 = require("../models/wine");
const GrapeVarietal_1 = require("../models/GrapeVarietal");
var sampleMock = {
    name: { faker: "lorem.words(2)" },
    color: { function: function () {
            const arr = ['red', 'white', 'rose'];
            return arr[Math.floor(Math.random() * arr.length)];
        } },
    year: { function: function () {
            let number = Math.floor(Math.random() * (2022 - 2000 + 1) + 2000);
            console.log(number);
            return number;
        } },
    description: { function: function () {
            return faker_1.faker.lorem.sentences(2);
        } },
    imageUrl: { function: function () {
            return faker_1.faker.image.imageUrl(1234, 2345, 'wine bottle', true);
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
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield wine_1.Wine.collection.drop();
            const winaries = yield winary_1.Winary.find({});
            const types = ["grape", "blend"];
            const grapeVarietals = yield GrapeVarietal_1.GrapeVarietal.find();
            let index = 0;
            for (const sample of data.sampleMock) {
                sample.winaryId = winaries[index];
                sample.type = types[Math.floor(Math.random() * types.length)];
                const samp = new wine_1.Wine(sample);
                if (samp.type == "grape") {
                    const rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                    samp.grapeVarietals.push(rand);
                }
                else {
                    const max = 5;
                    const min = 2;
                    const randNumberOfGrapes = Math.floor(Math.random() * (max - min) + min);
                    for (let i = 0; i < randNumberOfGrapes; i++) {
                        const rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                        samp.grapeVarietals.push(rand);
                    }
                }
                yield samp.save();
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
    });
}