"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElseDirectiveHandlerCompact = exports.ElseDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const selection_1 = require("./selection");
exports.ElseDirectiveHandler = (0, selection_1.CreateSelectionDirectiveHandler)(true);
function ElseDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.ElseDirectiveHandler);
}
exports.ElseDirectiveHandlerCompact = ElseDirectiveHandlerCompact;
