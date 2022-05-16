"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefsMagicHandlerCompact = exports.RefsMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const create_1 = require("../../../proxy/create");
const jit_1 = require("../../../proxy/jit");
exports.RefsMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('refs', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, jit_1.InitJITProxy)('refs', (component || (0, find_1.FindComponentById)(componentId)), contextElement);
    if (!elementKey || proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    return (scope[elementKey] = (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: name => { var _a; return (name && ((_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindRefElement(name))); },
        lookup: () => true,
    })));
});
function RefsMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.RefsMagicHandler);
}
exports.RefsMagicHandlerCompact = RefsMagicHandlerCompact;
