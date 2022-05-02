import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";

export const AttrDirectiveHandler = CreateDirectiveHandlerCallback('attr', ({ componentId, component, contextElement, expression, argKey }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), lastValues: Record<string, string | null> = {};
    if (argKey){
        lastValues[argKey] = contextElement.getAttribute(argKey);
    }

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddAttributeChangeCallback((name) => {
        let value = contextElement.getAttribute(name!);
        if (!lastValues.hasOwnProperty(name!) || value !== lastValues[name!]){
            lastValues[name!] = value;
            evaluate(undefined, [{ name, value }], { changed: { name, value } });
        }
    }, (argKey || undefined));
});

export function AttrDirectiveHandlerCompact(){
    AddDirectiveHandler(AttrDirectiveHandler);
}
