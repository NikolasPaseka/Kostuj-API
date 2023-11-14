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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importStar(require("mongoose")), Mongoose = mongoose_1;
const ts_dotenv_1 = require("ts-dotenv");
const env = (0, ts_dotenv_1.load)({
    ATLAS_DB_URL: String,
});
let connection;
const connect = () => {
    const url = env.ATLAS_DB_URL;
    if (connection) {
        return;
    }
    Mongoose.connect(url)
        .then(() => {
        console.log('mongo connection open');
        transformSchemasToClient();
    })
        .catch((err) => {
        console.log(`err: ${err}`);
    });
    connection = Mongoose.connection;
};
exports.connect = connect;
const disconnect = () => {
    if (!connection) {
        return;
    }
    Mongoose.disconnect();
    connection.once("close", async () => {
        console.log("Database connection closed");
    });
};
exports.disconnect = disconnect;
function transformSchemasToClient() {
    mongoose_1.default.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: (doc, converted) => {
            delete converted._id;
        }
    });
}
exports.default = transformSchemasToClient;