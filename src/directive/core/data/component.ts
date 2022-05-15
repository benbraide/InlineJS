import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { ToString } from "../../../utilities/to-string";

export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    let updateName = (name: string) => {
        let resolveComponent = (component || FindComponentById(componentId)), elementScope = resolveComponent?.FindElementScope(resolveComponent.GetRoot());
        if (!resolveComponent){
            return;
        }
        
        resolveComponent.SetName(name);
        elementScope?.SetLocal('$name', name);
        elementScope?.SetLocal('$componentName', name);
    };
    
    if (argKey === 'evaluate'){
        EvaluateLater({ componentId, contextElement, expression })(data => updateName(ToString(data)));
    }
    else{//Raw expression
        updateName(expression);
    }
});

export function ComponentDirectiveHandlerCompact(){
    AddDirectiveHandler(ComponentDirectiveHandler);
}
