"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./config/db.config");
const catalogue_routes_1 = require("./routes/catalogue.routes");
const winary_routes_1 = require("./routes/winary.routes");
// connect to databse
(0, db_config_1.connect)();
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
const catalogueRouter = new catalogue_routes_1.CatalogueRouter();
const winaryRouter = new winary_routes_1.WinaryRouter();
app.use('/catalogues', catalogueRouter.getRouter());
app.use('/winaries', winaryRouter.getRouter());
app.all('*', (req, res) => {
    res.send("not found");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
