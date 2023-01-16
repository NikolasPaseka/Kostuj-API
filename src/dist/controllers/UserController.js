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
class UserController {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
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
            //res.send("Successfully registered");
            return yield this.login(req, res);
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { email, password } = req.body;
            const foundUser = yield this.userRepository.getUserByEmail(email);
            const isMatch = bcrypt_1.default.compareSync(password, foundUser.password);
            if (isMatch) {
                const token = jsonwebtoken_1.default.sign({ _id: (_a = foundUser._id) === null || _a === void 0 ? void 0 : _a.toString(), email: foundUser.email }, auth_1.SECRET_KEY, {
                    expiresIn: '15 days',
                });
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
        this.getFavoriteWineState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wineId = req.params.wineId;
            const userId = req.token._id.toString();
            const result = yield this.userRepository.getFavoriteWine(wineId, userId);
            let isFavorite = false;
            let notes = "";
            if (result != null) {
                isFavorite = true;
                notes = result.notes;
            }
            return res.json({
                favorite: isFavorite,
                notes: notes
            });
        });
        this.changeFavoriteWineState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wineId = req.params.wineId;
            const userId = req.token._id.toString();
            const favorite = req.body.favorite;
            const result = yield this.userRepository.getFavoriteWine(wineId, userId);
            if (favorite && !result) {
                this.userRepository.changeFavoriteWineState(wineId, userId, true);
                return res.send("Wine added to favorites");
            }
            else if (!favorite && result) {
                this.userRepository.changeFavoriteWineState(wineId, userId, false, result.id);
                return res.send("Wine removed from favorites");
            }
            else {
                throw new ResponseError_1.ResponseError("Error occured while performing favorite wine request");
            }
        });
        this.getFavoriteWines = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const favoriteWines = yield this.userRepository.getFavoriteWines(userId);
            return res.json(favoriteWines);
        });
        this.updateFavoriteWineNotes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wineId = req.params.wineId;
            const userId = req.token._id.toString();
            const notes = req.body.notes;
            yield this.userRepository.updateFavoriteWineNotes(wineId, userId, notes);
            return res.send("Notes have been succesfully saved");
        });
        this.getFollowedCatalogues = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const followedCatalogues = yield this.userRepository.getFollowedCatalogues(userId);
            return res.json(followedCatalogues);
        });
        this.getFavoriteWineries = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const favoriteWineries = yield this.userRepository.getFavoriteWineries(userId);
            return res.json(favoriteWineries);
        });
        this.getFollowedCatalogueState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const catalogueId = req.params.catalogueId;
            const userId = req.token._id.toString();
            const result = yield this.userRepository.getFollowedCatalogue(catalogueId, userId);
            let isFollowed = false;
            if (result != null) {
                isFollowed = true;
            }
            return res.send(isFollowed);
        });
        this.changeFollowedCatalogueState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const catalogueId = req.params.catalogueId;
            const userId = req.token._id.toString();
            const follow = req.body.follow;
            const result = yield this.userRepository.getFollowedCatalogue(catalogueId, userId);
            if (follow && !result) {
                this.userRepository.followCatalogue(catalogueId, userId);
                return res.send("Catalogue is now followed");
            }
            else if (!follow && result) {
                this.userRepository.unfollowCatalogue(result.id);
                return res.send("Catalogue removed from followed");
            }
            else {
                throw new ResponseError_1.ResponseError("Error occured while performing follow catalogue request");
            }
        });
        this.changeFavoriteWineryState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wineryId = req.params.wineryId;
            const userId = req.token._id.toString();
            const favorite = req.body.favorite;
            const result = yield this.userRepository.getFavoriteWinery(wineryId, userId);
            if (favorite && !result) {
                this.userRepository.changeFavoriteWineryState(wineryId, userId, true);
                return res.send("Winery added to favorites");
            }
            else if (!favorite && result) {
                this.userRepository.changeFavoriteWineryState(wineryId, userId, false, result.id);
                return res.send("Winery removed from favorites");
            }
            else {
                throw new ResponseError_1.ResponseError("Error occured while performing favorite winery request");
            }
        });
        this.getFavoriteWineryState = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const wineryId = req.params.wineryId;
            const userId = req.token._id.toString();
            const result = yield this.userRepository.getFavoriteWinery(wineryId, userId);
            let isFavorite = false;
            if (result != null) {
                isFavorite = true;
            }
            return res.send(isFavorite);
        });
        this.getUpcomingCatalogueEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.token._id.toString();
            const result = yield this.userRepository.getUpcomingCatalogueEvent(userId);
            return res.json(result);
        });
    }
}
exports.UserController = UserController;
