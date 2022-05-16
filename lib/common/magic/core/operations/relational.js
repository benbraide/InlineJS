"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalMagicHandlerCompact = exports.RelationalMagicHandler = void 0;
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const create_1 = require("../../../proxy/create");
const methods = {
    comp: (first, second) => ((first < second) ? -1 : ((first == second) ? 0 : 1)),
    lt: (first, second) => (first < second),
    le: (first, second) => (first <= second),
    eq: (first, second) => (first == second),
    eqs: (first, second) => (first === second),
    nes: (first, second) => (first !== second),
    ne: (first, second) => (first != second),
    ge: (first, second) => (first >= second),
    gt: (first, second) => (first > second),
};
let proxy = null;
exports.RelationalMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('rel', () => (proxy || (proxy = (0, create_1.CreateReadonlyProxy)(methods))));
function RelationalMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.RelationalMagicHandler);
}
exports.RelationalMagicHandlerCompact = RelationalMagicHandlerCompact;
