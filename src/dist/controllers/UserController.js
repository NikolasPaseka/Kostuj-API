"use strict";
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
        this.getUserById = async (req, res) => {
            const { id } = req.params;
            const user = await this.userRepository.getUserById(id);
            res.json(user);
        };
        this.register = async (req, res) => {
            const user = req.body;
            await this.userRepository.createUser(user);
            return await this.login(req, res);
        };
        this.login = async (req, res) => {
            const { email, password } = req.body;
            const foundUser = await this.userRepository.getUserByEmail(email);
            const isMatch = bcrypt_1.default.compareSync(password, foundUser.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ _id: foundUser._id?.toString(), email: foundUser.email }, auth_1.SECRET_KEY, {});
                return res.json({
                    id: foundUser._id,
                    email: foundUser.email,
                    token: token
                });
            }
            else {
                throw new ResponseError_1.ResponseError("Incorrect credentials");
            }
        };
        this.deleteUser = async (req, res) => {
            const userId = req.token._id.toString();
            await this.userRepository.deleteUser(userId);
            res.json("User deleted");
        };
        this.getCommissionCatalogues = async (req, res) => {
            const userId = req.token._id.toString();
            const commissionCatalogues = await this.userRepository.getCommissionCatalogues(userId);
            const result = [];
            for (const catalogue of commissionCatalogues) {
                const ratedSamples = await this.userRepository.getRatedSamples(userId, catalogue.id);
                const samples = await this.catalogueRepository.getCatalogueSamples(catalogue.id);
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
        };
        this.getRatedSamples = async (req, res) => {
            const userId = req.token._id.toString();
            const catalogueId = req.params.catalogueId;
            const result = [];
            const ratedSamples = await this.userRepository.getRatedSamples(userId, catalogueId);
            for (const ratedSample of ratedSamples) {
                result.push({
                    id: ratedSample.id,
                    commissionMemberId: ratedSample.commissionMemberId,
                    sampleId: ratedSample.sampleId,
                    rating: ratedSample.rating
                });
            }
            return res.json(result);
        };
        this.addRatedSample = async (req, res) => {
            const userId = req.token._id.toString();
            const sampleId = req.body.sampleId;
            const rating = req.body.rating;
            const ratedSample = await this.userRepository.addRatedSample(userId, sampleId, rating, false);
            res.json(ratedSample);
        };
        this.updateRatedSample = async (req, res) => {
            const userId = req.token._id.toString();
            const sampleId = req.body.sampleId;
            const rating = req.body.rating;
            const ratedSample = await this.userRepository.addRatedSample(userId, sampleId, rating, true);
            res.json(ratedSample);
        };
        this.getTastedSamples = async (req, res) => {
            const userId = req.token._id.toString();
            const catalogueId = req.params.catalogueId;
            const tastedSamples = await this.userRepository.getTastedSamples(catalogueId, userId);
            res.json(tastedSamples);
        };
        this.updateTastedSamples = async (req, res) => {
            const userId = req.token._id.toString();
            const tastedSamples = req.body;
            await this.userRepository.updateTastedSamples(tastedSamples, userId);
            res.json("Successfuly updated");
        };
        this.deleteTastedSamples = async (req, res) => {
            const userId = req.token._id.toString();
            const tastedSamples = req.body;
            await this.userRepository.deleteTastedSamples(tastedSamples, userId);
            res.json("Successfuly deleted");
        };
    }
}
exports.UserController = UserController;
