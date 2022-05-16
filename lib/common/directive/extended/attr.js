"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttrDirectiveHandlerCompact = exports.AttrDirectiveHandler = void 0;
const find_1 = require("../../component/find");
const add_1 = require("../../directives/add");
const callback_1 = require("../../directives/callback");
const evaluate_later_1 = require("../../evaluator/evaluate-later");
exports.AttrDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('attr', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b;
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), lastValues = {};
    if (argKey) {
        lastValues[argKey] = contextElement.getAttribute(argKey);
    }
    (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddAttributeChangeCallback((name) => {
        let value = contextElement.getAttribute(name);
        if (!lastValues.hasOwnProperty(name) || value !== lastValues[name]) {
            lastValues[name] = value;
            evaluate(undefined, [{ name, value }], { changed: { name, value } });
        }
    }, (argKey || undefined));
});
function AttrDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.AttrDirectiveHandler);
}
exports.AttrDirectiveHandlerCompact = AttrDirectiveHandlerCompact;
