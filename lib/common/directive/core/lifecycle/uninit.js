"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninitDirectiveHandlerCompact = exports.UninitDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
exports.UninitDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('uninit', ({ componentId, component, contextElement, expression }) => {
    var _a, _b;
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression });
    (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => evaluate());
});
function UninitDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.UninitDirectiveHandler);
}
exports.UninitDirectiveHandlerCompact = UninitDirectiveHandlerCompact;
