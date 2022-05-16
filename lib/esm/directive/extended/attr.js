import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
export const AttrDirectiveHandler = CreateDirectiveHandlerCallback('attr', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b;
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), lastValues = {};
    if (argKey) {
        lastValues[argKey] = contextElement.getAttribute(argKey);
    }
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddAttributeChangeCallback((name) => {
        let value = contextElement.getAttribute(name);
        if (!lastValues.hasOwnProperty(name) || value !== lastValues[name]) {
            lastValues[name] = value;
            evaluate(undefined, [{ name, value }], { changed: { name, value } });
        }
    }, (argKey || undefined));
});
export function AttrDirectiveHandlerCompact() {
    AddDirectiveHandler(AttrDirectiveHandler);
}
