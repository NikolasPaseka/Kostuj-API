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
var mongoose_1 = __importDefault(require("mongoose"));
var faker_1 = require("@faker-js/faker");
var mocker_data_generator_1 = __importDefault(require("mocker-data-generator"));
var catalogue_1 = require("../models/catalogue");
var sample_1 = require("../models/sample");
var samples_1 = __importDefault(require("./samples"));
var commissionMember_1 = require("../models/commissionMember");
var ratedSample_1 = require("../models/ratedSample");
var user_1 = require("../models/user");
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
            var images = [];
            for (var i = 0; i < getRandomNumber(2, 5); i++) {
                images.push(faker_1.faker.image.imageUrl(1234, 2345, "wine", true));
            }
            return images;
        } }
};
var data = (0, mocker_data_generator_1.default)()
    .schema('sampleMock', sampleMock, 30)
    .buildSync();
mongoose_1.default.connect('mongodb+srv://passy:4R842dj2TqpKUVL8@mockeddb.weax9sr.mongodb.net/?retryWrites=true&w=majority')
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('mongo connection open');
                //transformSchemasToClient();
                return [4 /*yield*/, catalogue_1.Catalogue.collection.drop()];
            case 1:
                //transformSchemasToClient();
                _a.sent();
                return [4 /*yield*/, seedData()];
            case 2:
                _a.sent();
                return [4 /*yield*/, sample_1.Sample.collection.drop()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, samples_1.default)()];
            case 4:
                _a.sent();
                return [4 /*yield*/, commissionMember_1.CommissionMember.collection.drop()];
            case 5:
                _a.sent();
                return [4 /*yield*/, ratedSample_1.RatedSample.collection.drop()];
            case 6:
                _a.sent();
                return [4 /*yield*/, seedCommission()];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (err) {
    console.log("err: ".concat(err));
});
function seedData() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, catalogue, cat, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = data.sampleMock;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    catalogue = _a[_i];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    cat = new catalogue_1.Catalogue(catalogue);
                    return [4 /*yield*/, cat.save()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    console.log("done");
                    return [2 /*return*/];
            }
        });
    });
}
function seedCommission() {
    return __awaiter(this, void 0, void 0, function () {
        var users, catalogues, _i, users_1, user, numberToSeed, i, randomCatalogue, commissionMember, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.User.find({})];
                case 1:
                    users = _a.sent();
                    return [4 /*yield*/, catalogue_1.Catalogue.find({})];
                case 2:
                    catalogues = _a.sent();
                    _i = 0, users_1 = users;
                    _a.label = 3;
                case 3:
                    if (!(_i < users_1.length)) return [3 /*break*/, 10];
                    user = users_1[_i];
                    numberToSeed = getRandomNumber(1, 3);
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < numberToSeed)) return [3 /*break*/, 9];
                    randomCatalogue = catalogues[Math.floor(Math.random() * catalogues.length)];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    commissionMember = new commissionMember_1.CommissionMember({
                        catalogueId: randomCatalogue.id,
                        userId: user.id
                    });
                    return [4 /*yield*/, commissionMember.save()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    console.log("commission seeded");
                    return [2 /*return*/];
            }
        });
    });
}
