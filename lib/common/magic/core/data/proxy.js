"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMagicHandlerCompact = exports.ProxyMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.ProxyMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('proxy', ({ componentId, component }) => {
    var _a;
    return (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative();
});
function ProxyMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ProxyMagicHandler);
}
exports.ProxyMagicHandlerCompact = ProxyMagicHandlerCompact;
