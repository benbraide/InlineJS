"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitMagicHandlerCompact = exports.WaitMagicHandler = void 0;
const wait_promise_1 = require("../../../evaluator/wait-promise");
const wait_while_1 = require("../../../evaluator/wait-while");
const add_1 = require("../../../magics/add");
const callback_1 = require("../../../magics/callback");
exports.WaitMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('wait', () => {
    return (value, callback) => (0, wait_promise_1.WaitPromise)(value, value => (0, wait_while_1.WaitWhile)(value, callback, callback));
});
function WaitMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.WaitMagicHandler);
}
exports.WaitMagicHandlerCompact = WaitMagicHandlerCompact;
