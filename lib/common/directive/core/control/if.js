"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfDirectiveHandlerCompact = exports.IfDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const selection_1 = require("./selection");
exports.IfDirectiveHandler = (0, selection_1.CreateSelectionDirectiveHandler)(false);
function IfDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.IfDirectiveHandler);
}
exports.IfDirectiveHandlerCompact = IfDirectiveHandlerCompact;
