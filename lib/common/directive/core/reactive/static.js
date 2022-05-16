"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticDirectiveHandlerCompact = exports.StaticDirectiveHandler = void 0;
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
exports.StaticDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('static', ({ componentId, contextElement, expression }) => {
    (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })();
});
function StaticDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.StaticDirectiveHandler);
}
exports.StaticDirectiveHandlerCompact = StaticDirectiveHandlerCompact;
