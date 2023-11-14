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
var mongoose_1 = __importDefault(require("mongoose"));
var winary_1 = require("../models/winary");
var faker_1 = require("@faker-js/faker");
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
    .then(function () {
    console.log('mongo connection open');
    winary_1.Winary.collection.drop();
    seedData();
})
    .catch(function (err) {
    console.log("err: ".concat(err));
});
function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, winary, win, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _i = 0, _a = data.sampleMock;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    winary = _a[_i];
                    win = new winary_1.Winary(winary);
                    return [4 /*yield*/, win.save()];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log(data.sampleMock);
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 6];
                case 6:
                    console.log("done");
                    return [2 /*return*/];
            }
        });
    });
}
