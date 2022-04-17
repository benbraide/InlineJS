import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";

export const UninitDirectiveHandler = CreateDirectiveHandlerCallback('uninit', ({ componentId, component, contextElement, expression }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression });
    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => evaluate());
});

export function UninitDirectiveHandlerCompact(){
    AddDirectiveHandler(UninitDirectiveHandler);
}
