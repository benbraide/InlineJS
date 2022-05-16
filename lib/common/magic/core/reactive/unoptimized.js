"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoptimizedMagicHandlerCompact = exports.UnoptimizedMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.UnoptimizedMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('unoptimized', ({ componentId }) => {
    return (value) => {
        var _a;
        (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.RestoreOptimizedGetAccessStorage();
        return value;
    };
}, ({ componentId, component }) => { var _a; return (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.SwapOptimizedGetAccessStorage(); });
function UnoptimizedMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.UnoptimizedMagicHandler);
}
exports.UnoptimizedMagicHandlerCompact = UnoptimizedMagicHandlerCompact;
