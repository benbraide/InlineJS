"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvertAnimationEase = void 0;
const call_1 = require("./call");
function InvertAnimationEase(handler, params) {
    return (1 - (0, call_1.CallAnimationEase)(handler, params));
}
exports.InvertAnimationEase = InvertAnimationEase;
