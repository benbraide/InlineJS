"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeMagicHandlerCompact = exports.ScopesMagicHandler = exports.ScopeMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const create_1 = require("../../../proxy/create");
exports.ScopeMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('scope', ({ componentId, component, contextElement }) => {
    var _a;
    return (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement);
});
exports.ScopesMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('scopes', ({ componentId }) => {
    return (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({ getter: prop => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindScopeByName(prop); }, lookup: () => true }));
});
function ScopeMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ScopeMagicHandler);
    (0, add_1.AddMagicHandler)(exports.ScopesMagicHandler);
}
exports.ScopeMagicHandlerCompact = ScopeMagicHandlerCompact;
