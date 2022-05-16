import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ToString } from "../../../utilities/to-string";
export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    let updateName = (name) => {
        let resolveComponent = (component || FindComponentById(componentId)), elementScope = resolveComponent === null || resolveComponent === void 0 ? void 0 : resolveComponent.FindElementScope(resolveComponent.GetRoot());
        if (!resolveComponent) {
            return;
        }
        resolveComponent.SetName(name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$name', name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$componentName', name);
    };
    if (argKey === 'evaluate') {
        EvaluateLater({ componentId, contextElement, expression })(data => updateName(ToString(data)));
    }
    else { //Raw expression
        updateName(expression);
    }
});
export function ComponentDirectiveHandlerCompact() {
    AddDirectiveHandler(ComponentDirectiveHandler);
}
