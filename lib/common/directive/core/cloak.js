"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloakDirectiveHandlerCompact = exports.CloakDirectiveHandler = void 0;
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
exports.CloakDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('cloak', () => { });
function CloakDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.CloakDirectiveHandler);
}
exports.CloakDirectiveHandlerCompact = CloakDirectiveHandlerCompact;
