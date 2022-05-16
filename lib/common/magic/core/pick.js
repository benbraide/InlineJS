"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickMagicHandlerCompact = exports.PickMagicHandler = void 0;
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
exports.PickMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('pick', () => {
    return (pred, trueValue, falseValue) => (!!pred ? trueValue : falseValue);
});
function PickMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.PickMagicHandler);
}
exports.PickMagicHandlerCompact = PickMagicHandlerCompact;
