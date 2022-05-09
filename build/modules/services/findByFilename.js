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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
/* eslint-disable no-restricted-syntax */
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const filesDir = path_1.default.resolve('./src/files');
const HOST_API = process.env.HOST_API || 'http://localhost:3000';
const exec = util_1.default.promisify(require('child_process').exec);
const execAwait = (process) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stdout } = yield exec(process);
        return stdout;
    }
    catch (err) {
        return false;
    }
});
const execute = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const findResult = yield execAwait(`find ${process.env.PATH_TO_SERVER_DOWNLOAD} | grep "${filename}"`);
    if (findResult) {
        const filenames = [];
        yield execAwait(`rm -rf ${filesDir}/*`);
        yield execAwait(`touch ${filesDir}/.gitkeep`);
        const filesList = findResult.split('\n');
        try {
            for (var filesList_1 = __asyncValues(filesList), filesList_1_1; filesList_1_1 = yield filesList_1.next(), !filesList_1_1.done;) {
                const element = filesList_1_1.value;
                const elPartial = element.split('/');
                const fname = (elPartial[elPartial.length - 1]).split(' ').join('');
                const pathOrig = ((element.split(' ').join('\\ ')).split('(').join('\\('))
                    .split(')')
                    .join('\\)');
                const pathDest = `${filesDir}/${(fname.split('(').join('\\(')).split(')').join('\\)')}`;
                if (element.length > 0) {
                    const cp = yield execAwait(`cp ${pathOrig} ${pathDest}`);
                    if (cp !== false) {
                        filenames.push({ filename: fname, url: `${HOST_API}/files/${fname}` });
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (filesList_1_1 && !filesList_1_1.done && (_a = filesList_1.return)) yield _a.call(filesList_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return Promise.resolve(filenames);
    }
    return Promise.resolve({ nodata: true, search: filename });
});
exports.execute = execute;
