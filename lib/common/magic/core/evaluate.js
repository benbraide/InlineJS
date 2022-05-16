"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateMagicHandlerCompact = exports.EvaluateMagicHandler = exports.FunctionMagicHandler = void 0;
const evaluate_later_1 = require("../../evaluator/evaluate-later");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
exports.FunctionMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('func', ({ componentId, contextElement }) => {
    return (expression) => (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
});
exports.EvaluateMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('eval', ({ componentId, contextElement }) => {
    return (expression, callback) => (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })(callback);
});
function EvaluateMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.FunctionMagicHandler);
    (0, add_1.AddMagicHandler)(exports.EvaluateMagicHandler);
}
exports.EvaluateMagicHandlerCompact = EvaluateMagicHandlerCompact;
