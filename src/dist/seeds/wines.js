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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
var faker_1 = require("@faker-js/faker");
var mongoose_1 = __importDefault(require("mongoose"));
var winary_1 = require("../models/winary");
var wine_1 = require("../models/wine");
var grapeVarietal_1 = require("../models/grapeVarietal");
function getRandomFloat(min, max, decimals) {
    var str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var sampleMock = {
    name: { faker: "lorem.words(2)" },
    color: { function: function () {
            var arr = ['red', 'white', 'rose'];
            return arr[Math.floor(Math.random() * arr.length)];
        } },
    year: { function: function () {
            var number = Math.floor(Math.random() * (2022 - 2010 + 1) + 2010);
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
    .then(function () {
    console.log('mongo connection open');
    seedData();
})
    .catch(function (err) {
    console.log("err: ".concat(err));
});
function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var winaries, grapeVarietals, index, _i, _a, sample, samp, rand, max, min, randNumberOfGrapes, i, rand, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, wine_1.Wine.collection.drop()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, winary_1.Winary.find({})];
                case 2:
                    winaries = _b.sent();
                    return [4 /*yield*/, grapeVarietal_1.GrapeVarietal.find()];
                case 3:
                    grapeVarietals = _b.sent();
                    index = 0;
                    _i = 0, _a = data.sampleMock;
                    _b.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    sample = _a[_i];
                    sample.winaryId = winaries[index];
                    samp = new wine_1.Wine(sample);
                    if (getRandomFloat(0, 1, 2) < 0.8) {
                        rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                        samp.grapeVarietals.push(rand);
                    }
                    else {
                        max = 3;
                        min = 2;
                        randNumberOfGrapes = Math.floor(Math.random() * (max - min) + min);
                        for (i = 0; i < randNumberOfGrapes; i++) {
                            rand = grapeVarietals[Math.floor(Math.random() * grapeVarietals.length)];
                            samp.grapeVarietals.push(rand);
                        }
                    }
                    return [4 /*yield*/, samp.save()];
                case 5:
                    _b.sent();
                    if (index >= winaries.length - 1) {
                        index = 0;
                    }
                    else {
                        index++;
                    }
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 9];
                case 9:
                    console.log("done lol");
                    return [2 /*return*/];
            }
        });
    });
}
