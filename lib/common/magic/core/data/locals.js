"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsMagicHandlerCompact = exports.LocalsMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.LocalsMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('locals', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetLocals();
});
function LocalsMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.LocalsMagicHandler);
}
exports.LocalsMagicHandlerCompact = LocalsMagicHandlerCompact;
