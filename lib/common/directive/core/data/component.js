"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentDirectiveHandlerCompact = exports.ComponentDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const to_string_1 = require("../../../utilities/to-string");
exports.ComponentDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('component', ({ componentId, component, contextElement, expression, argKey }) => {
    let updateName = (name) => {
        let resolveComponent = (component || (0, find_1.FindComponentById)(componentId)), elementScope = resolveComponent === null || resolveComponent === void 0 ? void 0 : resolveComponent.FindElementScope(resolveComponent.GetRoot());
        if (!resolveComponent) {
            return;
        }
        resolveComponent.SetName(name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$name', name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$componentName', name);
    };
    if (argKey === 'evaluate') {
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })(data => updateName((0, to_string_1.ToString)(data)));
    }
    else { //Raw expression
        updateName(expression);
    }
});
function ComponentDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.ComponentDirectiveHandler);
}
exports.ComponentDirectiveHandlerCompact = ComponentDirectiveHandlerCompact;
