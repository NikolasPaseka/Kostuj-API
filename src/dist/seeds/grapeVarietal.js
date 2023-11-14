"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GrapeVarietal_1 = require("../models/GrapeVarietal");
const odrudy_json_1 = __importDefault(require("./odrudy.json"));
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
    console.log('mongo connection open');
    GrapeVarietal_1.GrapeVarietal.collection.drop();
    seedData();
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
async function seedData() {
    try {
        for (const grapeVarietal of odrudy_json_1.default) {
            const saveableObject = new GrapeVarietal_1.GrapeVarietal({ grape: grapeVarietal.odrůda, shortcut: grapeVarietal.zkratka });
            await saveableObject.save();
        }
        console.log("done");
    }
    catch (e) {
        console.log(e);
    }
    //mongoose.connection.close()
}
