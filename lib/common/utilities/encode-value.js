"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncodeValue = void 0;
const infer_1 = require("../component/infer");
const get_1 = require("../global/get");
const to_string_1 = require("./to-string");
function EncodeValue(value, componentId, contextElement) {
    var _a;
    if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        return (0, to_string_1.ToString)(value);
    }
    return (0, get_1.GetGlobal)().StoreObject({
        object: value,
        componentId: (componentId || (contextElement ? (_a = (0, infer_1.InferComponent)(contextElement)) === null || _a === void 0 ? void 0 : _a.GetId() : undefined)),
        contextElement,
    });
}
exports.EncodeValue = EncodeValue;
