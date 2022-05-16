"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMagicHandlerCompact = exports.ResourceMagicHandler = void 0;
const names_1 = require("../../concepts/names");
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
function CreateResourceProxy() {
    const getCollectionConcept = () => (0, get_1.GetGlobal)().GetConcept(names_1.ResourceConceptName);
    let methods = {
        get: (params) => { var _a; return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.Get(params); },
        getStyle: (path, concurrent, attributes) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetStyle(path, concurrent, attributes);
        },
        getScript: (path, concurrent, attributes) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetScript(path, concurrent, attributes);
        },
        getData: (path, concurrent, json) => {
            var _a;
            return (_a = getCollectionConcept()) === null || _a === void 0 ? void 0 : _a.GetData(path, concurrent, json);
        },
    };
    return (0, create_1.CreateReadonlyProxy)(methods);
}
const ResourceProxy = CreateResourceProxy();
exports.ResourceMagicHandler = (0, callback_1.CreateMagicHandlerCallback)(names_1.ResourceConceptName, () => ResourceProxy);
function ResourceMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ResourceMagicHandler);
}
exports.ResourceMagicHandlerCompact = ResourceMagicHandlerCompact;
