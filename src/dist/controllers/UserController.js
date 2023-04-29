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
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
const UserRepository_1 = require("../repositories/UserRepository");
const ResponseError_1 = require("../utils/ResponseError");
const CatalogueRepository_1 = require("../repositories/CatalogueRepository");
class UserController {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
        this.catalogueRepository = new CatalogueRepository_1.CatalogueRepository();
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.getUsers();
            res.json(users);
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield this.userRepository.getUserById(id);
            res.json(user);
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            yield this.userRepository.createUser(user);
            return yield this.login(req, res);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            const foundUser = yield this.userRepository.getUserByEmail(email);
            const isMatch = bcrypt_1.default.compareSync(password, foundUser.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ _id: (_a = foundUser._id) === null || _a === void 0 ? void 0 : _a.toString(), email: foundUser.email }, auth_1.SECRET_KEY, {});
                return res.json({
                    id: foundUser._id,
                    email: foundUser.email,
                    token: token
                });
            }
            else {
                throw new ResponseError_1.ResponseError("Incorrect credentials");
            }
        });
        this.getCommissionCatalogues = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const commissionCatalogues = yield this.userRepository.getCommissionCatalogues(userId);
            const result = [];
            for (const catalogue of commissionCatalogues) {
                const ratedSamples = yield this.userRepository.getRatedSamples(userId, catalogue.id);
                const samples = yield this.catalogueRepository.getCatalogueSamples(catalogue.id);
                result.push({
                    id: catalogue.id,
                    title: catalogue.title,
                    startDate: catalogue.startDate,
                    imageUrl: catalogue.imageUrl,
                    numberOfRated: ratedSamples.length,
                    numberOfSamples: samples.length
                });
            }
            return res.json(result);
        });
        this.getRatedSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const catalogueId = req.params.catalogueId;
            const result = [];
            const ratedSamples = yield this.userRepository.getRatedSamples(userId, catalogueId);
            for (const ratedSample of ratedSamples) {
                result.push({
                    id: ratedSample.id,
                    commissionMemberId: ratedSample.commissionMemberId,
                    sampleId: ratedSample.sampleId,
                    rating: ratedSample.rating
                });
            }
            return res.json(result);
        });
        this.addRatedSample = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const sampleId = req.body.sampleId;
            const rating = req.body.rating;
            const ratedSample = yield this.userRepository.addRatedSample(userId, sampleId, rating, false);
            res.json(ratedSample);
        });
        this.updateRatedSample = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const sampleId = req.body.sampleId;
            const rating = req.body.rating;
            const ratedSample = yield this.userRepository.addRatedSample(userId, sampleId, rating, true);
            res.json(ratedSample);
        });
        this.getTastedSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const catalogueId = req.params.catalogueId;
            const tastedSamples = yield this.userRepository.getTastedSamples(catalogueId, userId);
            res.json(tastedSamples);
        });
        this.updateTastedSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const tastedSamples = req.body;
            yield this.userRepository.updateTastedSamples(tastedSamples, userId);
            res.json("Successfuly updated");
        });
        this.deleteTastedSamples = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const tastedSamples = req.body;
            yield this.userRepository.deleteTastedSamples(tastedSamples, userId);
            res.json("Successfuly deleted");
        });
    }
}
exports.UserController = UserController;
