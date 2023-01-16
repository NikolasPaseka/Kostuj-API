"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./config/db.config");
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    PORT: Number,
});
const winary_routes_1 = __importDefault(require("./routes/winary.routes"));
const catalogue_routes_1 = __importDefault(require("./routes/catalogue.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const mapLocation_routes_1 = __importDefault(require("./routes/mapLocation.routes"));
const wines_routes_1 = __importDefault(require("./routes/wines.routes"));
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
app.use('/catalogues', (0, catalogue_routes_1.default)());
app.use('/wineries', (0, winary_routes_1.default)());
app.use('/wines', (0, wines_routes_1.default)());
app.use('/users', (0, user_routes_1.default)());
app.use("/mapLocations", (0, mapLocation_routes_1.default)());
app.all('*', (req, res) => {
    res.send("not found");
});
app.use(errorHandler_1.errorHandler);
const port = env.PORT || 3000;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
