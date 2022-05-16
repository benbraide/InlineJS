"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertMagicHandlerCompact = exports.AlertMagicHandler = void 0;
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
function CreateAlertProxy() {
    const getCollectionConcept = () => (0, get_1.GetGlobal)().GetConcept('alert');
    let methods = {
        notify: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Notify(options); },
        confirm: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Confirm(options); },
        prompt: (options) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Prompt(options); },
    };
    return (0, create_1.CreateReadonlyProxy)(methods);
}
const AlertProxy = CreateAlertProxy();
exports.AlertMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('alert', () => AlertProxy);
function AlertMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.AlertMagicHandler);
}
exports.AlertMagicHandlerCompact = AlertMagicHandlerCompact;
