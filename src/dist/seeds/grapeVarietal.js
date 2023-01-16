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
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const grapeVarietal of odrudy_json_1.default) {
                const saveableObject = new GrapeVarietal_1.GrapeVarietal({ grape: grapeVarietal.odrůda, shortcut: grapeVarietal.zkratka });
                yield saveableObject.save();
            }
            console.log("done");
        }
        catch (e) {
            console.log(e);
        }
        //mongoose.connection.close()
    });
}
