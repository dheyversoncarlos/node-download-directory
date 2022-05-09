"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.routes = void 0;
const findByFilename_1 = require("../modules/services/findByFilename");
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pageDir = path_1.default.resolve('./src/pages');
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.get('/', (req, res) => {
    res.sendFile(`${pageDir}/search.html`);
});
routes.get('/css/:file', (req, res) => {
    const { file } = req.params;
    res.sendFile(`${pageDir}/css/${file}.css`);
});
routes.post('/search', (req, res) => {
    const { inputTxt, inputUser, inputToken } = req.body;
    //validando acesso
    if (process.env.USERNAME == inputUser && process.env.TOKEN == inputToken) {
        //efetuando busca
        (0, findByFilename_1.execute)(inputTxt).then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
    else {
        res.status(401).send('Not allowed! Verify credentials.');
    }
});
