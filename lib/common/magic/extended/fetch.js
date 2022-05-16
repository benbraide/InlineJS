"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMagicHandlerCompact = exports.FetchMagicHandler = void 0;
const extended_1 = require("../../concepts/fetch/extended");
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
const ExtendedFetch = new extended_1.ExtendedFetchConcept();
function CreateFetchProxy() {
    let methods = {
        install: () => (0, get_1.GetGlobal)().SetFetchConcept(ExtendedFetch),
        uninstall: () => (0, get_1.GetGlobal)().SetFetchConcept(null),
        get: (input, init) => ExtendedFetch.Get(input, init),
        addPathHandler: (path, handler) => ExtendedFetch.AddPathHandler(path, handler),
        removePathHandler: (handler) => ExtendedFetch.RemovePathHandler(handler),
        mockResponse: (params) => ExtendedFetch.MockResponse(params),
    };
    return (0, create_1.CreateReadonlyProxy)(methods);
}
const FetchProxy = CreateFetchProxy();
exports.FetchMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('fetch', () => FetchProxy);
function FetchMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.FetchMagicHandler);
}
exports.FetchMagicHandlerCompact = FetchMagicHandlerCompact;
