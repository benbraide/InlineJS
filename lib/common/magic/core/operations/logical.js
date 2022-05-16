"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalMagicHandlerCompact = exports.LogicalMagicHandler = void 0;
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const create_1 = require("../../../proxy/create");
const methods = {
    or: (...values) => values.at(values.findIndex(value => !!value)),
    and: (...values) => values.at(values.findIndex(value => !value)),
};
let proxy = null;
exports.LogicalMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('log', () => (proxy || (proxy = (0, create_1.CreateReadonlyProxy)(methods))));
function LogicalMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.LogicalMagicHandler);
}
exports.LogicalMagicHandlerCompact = LogicalMagicHandlerCompact;
