"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeMagicHandlerCompact = exports.NativeMagicHandler = void 0;
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const get_target_1 = require("../../../utilities/get-target");
exports.NativeMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('ancestor', () => get_target_1.GetTarget);
function NativeMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.NativeMagicHandler);
}
exports.NativeMagicHandlerCompact = NativeMagicHandlerCompact;
