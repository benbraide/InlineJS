"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentMagicHandlerCompact = exports.ComponentNameMagicHandler = exports.ComponentMagicHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.ComponentMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('component', () => (name) => { var _a; return (_a = (0, find_1.FindComponentByName)(name)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative(); });
exports.ComponentNameMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('name', ({ componentId, component }) => { var _a; return (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetName(); });
function ComponentMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ComponentMagicHandler);
    (0, add_1.AddMagicHandler)(exports.ComponentNameMagicHandler);
}
exports.ComponentMagicHandlerCompact = ComponentMagicHandlerCompact;
