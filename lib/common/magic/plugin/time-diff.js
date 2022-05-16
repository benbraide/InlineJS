"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeDifferenceMagicHandlerCompact = exports.TimeDifferenceMagicHandler = void 0;
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
function CreateTimeDifferenceProxy() {
    let methods = {
        format: (params) => { var _a; return (_a = (0, get_1.GetGlobal)().GetConcept('tdiff')) === null || _a === void 0 ? void 0 : _a.Format(params); },
    };
    return (0, create_1.CreateReadonlyProxy)(methods);
}
const TimeDifferenceProxy = CreateTimeDifferenceProxy();
exports.TimeDifferenceMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('tdiff', () => TimeDifferenceProxy);
function TimeDifferenceMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.TimeDifferenceMagicHandler);
}
exports.TimeDifferenceMagicHandlerCompact = TimeDifferenceMagicHandlerCompact;
