"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefDirectiveHandlerCompact = exports.RefDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const to_string_1 = require("../../../utilities/to-string");
exports.RefDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    if (argKey === 'evaluate') {
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })(data => { var _a; return (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.AddRefElement((0, to_string_1.ToString)(data), contextElement); });
    }
    else { //Raw expression
        component === null || component === void 0 ? void 0 : component.AddRefElement(expression, contextElement);
    }
});
function RefDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.RefDirectiveHandler);
}
exports.RefDirectiveHandlerCompact = RefDirectiveHandlerCompact;
