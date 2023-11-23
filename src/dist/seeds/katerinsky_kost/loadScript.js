"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sync_1 = require("csv-parse/sync");
const db_connect_1 = require("../config/db.connect");
const GrapeVarietal_1 = require("../../models/GrapeVarietal");
const Winary_1 = require("../../models/Winary");
const Wine_1 = require("../../models/Wine");
const Sample_1 = require("../../models/Sample");
const mongoose_1 = __importDefault(require("mongoose"));
let grapes = [];
async function loadGrapeVarietals() {
    const csvFilePath = path.resolve(__dirname, './odrudy.csv');
    const headers = ['id', 'shortcut', 'name', 'color'];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    await GrapeVarietal_1.GrapeVarietal.collection.drop();
    grapes = (0, sync_1.parse)(fileContent, {
        delimiter: ';',
        columns: headers
    });
    for (var res of grapes) {
        res.color = (() => {
            switch (res.color) {
                case "B":
                    return "white";
                case "Č":
                    return "red";
                case "R":
                    return "rose";
            }
        })();
        const grapeVarietal = new GrapeVarietal_1.GrapeVarietal({
            grape: res.name,
            shortcut: res.shortcut,
            color: res.color
        });
        const db = await grapeVarietal.save();
        console.log(db);
    }
}
async function loadWineries() {
    const csvFilePath = path.resolve(__dirname, './vinarstvi.csv');
    const headers = ['id', 'vinarstvi', 'obec', 'email', 'telefon', 'web'];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    await Winary_1.Winary.collection.drop();
    const results = (0, sync_1.parse)(fileContent, {
        delimiter: ';',
        columns: headers
    });
    for (var res of results) {
        if (res.email == '') {
            res.email = null;
        }
        if (res.telefon == '') {
            res.telefon = null;
        }
        if (res.web == '') {
            res.web = null;
        }
        const winery = new Winary_1.Winary({
            name: res.vinarstvi,
            phoneNumber: res.telefon,
            email: res.email,
            websitesUrl: res.web,
            address: res.obec,
        });
        const db = await winery.save();
        console.log(db);
    }
}
async function loadWines() {
    const csvFilePath = path.resolve(__dirname, './vina.csv');
    const headers = ['oznaceni', 'id_vinarstvi', 'vinarstvi', 'obec', 'odruda', 'barva', 'privlastek', 'rocnik', 'odrudy', 'sladkost', 'poznamka', 'komise', 'body', 'nic', 'sampion'];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    await Wine_1.Wine.collection.drop();
    await Sample_1.Sample.collection.drop();
    const wines = (0, sync_1.parse)(fileContent, {
        delimiter: ';',
        columns: headers
    });
    let i = 0;
    for (var wine of wines) {
        const foundWinery = await Winary_1.Winary.findOne({ name: wine.vinarstvi }).lean();
        if (foundWinery == undefined || foundWinery == null) {
            console.log(wine);
        }
        wine.barva = (() => {
            switch (wine.barva) {
                case "B":
                    return "white";
                case "Č":
                    return "red";
                case "R":
                    return "rose";
                case "F":
                    return "red";
            }
        })();
        const grapes = wine.odrudy.split(",");
        let grapesObject = [];
        if (grapes.length == 1 && grapes[0] == '') {
            grapesObject = null;
        }
        else {
            for (var grape of grapes) {
                const res = await GrapeVarietal_1.GrapeVarietal.findOne({ shortcut: grape });
                grapesObject.push(res);
            }
        }
        if (wine.oznaceni == 553) {
            console.log(wine.rocnik);
        }
        const newWine = new Wine_1.Wine({
            name: wine.odruda,
            color: wine.barva,
            year: wine.rocnik,
            residualSugar: null,
            alcoholContent: null,
            acidity: null,
            grapesSweetness: null,
            tasteResult: wine.sladkost,
            productionMethod: wine.poznamka,
            grapeVarietals: grapesObject,
            imageUrl: null,
            winaryId: foundWinery._id
        });
        const db = await newWine.save();
        let sampion = false;
        if (wine.sampion == "Šampion") {
            sampion = true;
        }
        let body = 0;
        if (wine.body == "nehodnoceno") {
            body = null;
        }
        else {
            body = parseInt(wine.body);
        }
        const newSample = new Sample_1.Sample({
            name: wine.oznaceni,
            rating: body,
            champion: sampion,
            catalogueId: new mongoose_1.default.Types.ObjectId("655d319b31be7b63c77db6c3"),
            wineId: db
        });
        const db2 = await newSample.save();
    }
    console.log("done");
}
//connect(loadGrapeVarietals);
//connect(loadWineries);
(0, db_connect_1.connect)(loadWines);
