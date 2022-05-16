"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfig = void 0;
const get_1 = require("../global/get");
function GetConfig() {
    return (0, get_1.GetGlobal)().GetConfig();
}
exports.GetConfig = GetConfig;
