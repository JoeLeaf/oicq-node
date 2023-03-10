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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeStruct = exports.encodeWrapper = exports.decodeWrapper = void 0;
const jce = __importStar(require("./jce.lib"));
function decodeWrapper(blob) {
    const wrapper = jce.decode(blob);
    const map = jce.decode(wrapper[7])[0];
    let nested = map[Object.keys(map)[0]];
    if (nested instanceof Buffer === false)
        nested = nested[Object.keys(nested)[0]];
    return jce.decode(nested)[0];
}
exports.decodeWrapper = decodeWrapper;
function encodeWrapper(map, servant, func, reqid = 0) {
    return jce.encode([
        null,
        3, 0,
        0, reqid,
        servant, func,
        jce.encode([map]), 0,
        {}, {},
    ]);
}
exports.encodeWrapper = encodeWrapper;
function encodeStruct(nested) {
    return jce.encode([jce.encodeNested(nested)]);
}
exports.encodeStruct = encodeStruct;
__exportStar(require("./jce.lib"), exports);
