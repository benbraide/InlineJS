"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextTickMagicHandlerCompact = exports.NextTickMagicHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
exports.NextTickMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('nextTick', ({ componentId }) => {
    return (callback) => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(callback); };
});
function NextTickMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.NextTickMagicHandler);
}
exports.NextTickMagicHandlerCompact = NextTickMagicHandlerCompact;
