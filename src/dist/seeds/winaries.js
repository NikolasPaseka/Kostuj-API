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
var sampleMock = {
    name: { faker: "lorem.words(3)" },
    address: { faker: "address.streetAddress" },
    imageUrl: { faker: "image.nightlife" },
    location: {
        latitude: { faker: "address.latitude" },
        longitude: { faker: "address.longitude" }
    }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 200)
    .buildSync();
mongoose_1.default.connect('mongodb://localhost:27017/kostuj')
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
            for (const winary of data.sampleMock) {
                const win = new winary_1.Winary(winary);
                win.save();
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
