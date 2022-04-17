import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ToString } from "../../../utilities/to-string";

export const RefDirectiveHandler = CreateDirectiveHandlerCallback('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    if (argKey === 'evaluate'){
        EvaluateLater({ componentId, contextElement, expression })(data => FindComponentById(componentId)?.AddRefElement(ToString(data), contextElement));
    }
    else{//Raw expression
        component?.AddRefElement(expression, contextElement);
    }
});

export function RefDirectiveHandlerCompact(){
    AddDirectiveHandler(RefDirectiveHandler);
}
