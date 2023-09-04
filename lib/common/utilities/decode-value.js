"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeValue = void 0;
const infer_1 = require("../component/infer");
const stored_object_1 = require("./stored-object");
function DecodeValue(value, componentId, contextElement) {
    var _a;
    return (0, stored_object_1.RetrieveStoredObject)({
        key: value,
        componentId: (componentId || (contextElement ? (_a = (0, infer_1.InferComponent)(contextElement)) === null || _a === void 0 ? void 0 : _a.GetId() : undefined)),
        contextElement,
    });
}
exports.DecodeValue = DecodeValue;
