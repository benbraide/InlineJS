import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ToString } from "../../../utilities/to-string";

export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    if (argKey === 'evaluate'){
        EvaluateLater({ componentId, contextElement, expression })(data => FindComponentById(componentId)?.SetName(ToString(data)));
    }
    else{//Raw expression
        component?.SetName(expression);
    }
});

export function ComponentDirectiveHandlerCompact(){
    AddDirectiveHandler(ComponentDirectiveHandler);
}
