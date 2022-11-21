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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const winary_1 = require("./models/winary");
const sample_1 = require("./models/sample");
const wine_1 = require("./models/wine");
const catalogue_1 = require("./models/catalogue");
mongoose_1.default.connect('mongodb://localhost:27017/kostuj')
    .then(() => {
    console.log('mongo connection open');
})
    .catch((err) => {
    console.log(`err: ${err}`);
});
const app = (0, express_1.default)();
// configure the app to use bodyParser()
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
app.use(body_parser_1.default.json());
// routes
app.get('/', (req, res) => {
    res.send("hello from typescript + express!!!");
});
app.get('/winaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const winaries = yield winary_1.Winary.find({});
        res.status(200).json(winaries);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get('/samples', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const samples = yield sample_1.Sample.find({});
        res.status(200).json(samples);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get('/catalogues', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const catalogues = yield catalogue_1.Catalogue.find({});
        res.status(200).json(catalogues);
    }
    catch (e) {
        console.log(e);
    }
}));
app.get('/catalogues/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const catalogue = yield catalogue_1.Catalogue.findById(id);
        if (catalogue != null) {
            res.status(200).json(catalogue);
        }
        else {
            res.status(404);
        }
    }
    catch (e) {
        console.log(e);
    }
}));
app.get('/catalogues/:id/samples', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const samples = yield sample_1.Sample.find({
            catalogueId: id
        })
            .populate({ path: 'wineId', model: wine_1.Wine });
        res.status(200).json(samples);
    }
    catch (e) {
        console.log(e);
    }
}));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
