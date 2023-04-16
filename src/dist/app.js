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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_config_1 = require("./config/db.config");
const ts_dotenv_1 = require("ts-dotenv");
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger.json"));
const winary_routes_1 = __importDefault(require("./routes/winary.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const mapLocation_routes_1 = __importDefault(require("./routes/mapLocation.routes"));
const catalogue_routes_1 = __importDefault(require("./routes/catalogue.routes"));
const wines_routes_1 = __importDefault(require("./routes/wines.routes"));
const env = (0, ts_dotenv_1.load)({
    PORT: Number,
});
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
    res.send("Kostuj API");
});
app.use('/catalogues', catalogue_routes_1.default);
app.use('/wineries', winary_routes_1.default);
app.use('/wines', wines_routes_1.default);
app.use('/users', user_routes_1.default);
app.use("/mapLocations", mapLocation_routes_1.default);
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.all('*', (req, res) => {
    res.send("not found");
});
app.use(errorHandler_1.errorHandler);
const port = env.PORT || 3000;
app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
