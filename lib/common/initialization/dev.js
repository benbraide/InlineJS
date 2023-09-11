"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializeDev = void 0;
const auto_1 = require("../bootstrap/auto");
const get_1 = require("../global/get");
const interpolation_1 = require("../global/interpolation");
function InitializeDev(bootstrap = true) {
    bootstrap && (0, auto_1.AutoBootstrap)();
    (0, get_1.GetGlobal)().AddAttributeProcessor(interpolation_1.AttributeInterpolator);
    (0, get_1.GetGlobal)().AddTextContentProcessor(interpolation_1.TextContentInterpolator);
}
exports.InitializeDev = InitializeDev;
