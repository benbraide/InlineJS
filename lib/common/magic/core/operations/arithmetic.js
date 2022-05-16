"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArithmeticMagicHandlerCompact = exports.ArithmeticMagicHandler = void 0;
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
const create_1 = require("../../../proxy/create");
const methods = {
    add: (...values) => values.reduce((acc, value) => (acc + value)),
    subtract: (...values) => values.reduce((acc, value) => (acc - value)),
    multiply: (...values) => values.reduce((acc, value) => (acc * value)),
    divide: (...values) => values.reduce((acc, value) => (acc / value)),
};
let proxy = null;
exports.ArithmeticMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('math', () => (proxy || (proxy = (0, create_1.CreateReadonlyProxy)(methods))));
function ArithmeticMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.ArithmeticMagicHandler);
}
exports.ArithmeticMagicHandlerCompact = ArithmeticMagicHandlerCompact;
