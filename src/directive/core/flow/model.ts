import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { UseEffect } from "../../../reactive/effect";
import { IsEqual } from "../../../utilities/is-equal";
import { ToString } from "../../../utilities/to-string";
import { ResolveOptions } from "../../options";

export const ModelDirectiveHandler = CreateDirectiveHandlerCallback('model', ({ componentId, component, contextElement, expression, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        lazy: false,
        number: false,
        forced: false,
        trim: false,
    }, argOptions);

    let transformData = (data: any) => {
        let transformed = (options.number ? parseFloat(ToString(data)) : null);
        return ((transformed || transformed === 0) ? transformed : ((options.number && options.forced) ? 0 : (options.trim ? ToString(data).trim() : data)));
    };

    let evaluateAssignment = (value: any) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${value})`,
        })();
    };
    
    let isRadio = (contextElement instanceof HTMLInputElement && contextElement.type === 'radio');
    let isCheckable = (isRadio || (contextElement instanceof HTMLInputElement && contextElement.type === 'checkbox'));
    let ref: any = null, hotValue = false, assign = () => {
        if (!isCheckable && (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement)){
            let transformed = transformData(contextElement.value);
            evaluateAssignment((typeof transformed === 'number') ? transformed : `'${ToString(transformed)}'`);
        }
        else if (isCheckable && !isRadio){
            if (Array.isArray(ref)){//Add value to array
                let transformed = transformData((contextElement as HTMLInputElement).value), index = ref.indexOf(transformed);
                if (index == -1 && (contextElement as HTMLInputElement).checked){
                    ref.push(transformed);
                }
                else if (index != -1 && !(contextElement as HTMLInputElement).checked){
                    ref.splice(index, 1);
                }
            }
            else{
                evaluateAssignment((contextElement as HTMLInputElement).checked ? 'true' : 'false');
            }
        }
        else if (isRadio){
            let transformed = transformData((contextElement as HTMLInputElement).value);
            evaluateAssignment((contextElement as HTMLInputElement).checked ? ((typeof transformed === 'number') ? transformed : `'${ToString(transformed)}'`) : '');
        }
        else if ((contextElement as HTMLSelectElement).multiple){//Retrieve all selected
            let value = Array.from((contextElement as HTMLSelectElement).selectedOptions).map(item => transformData(item.value));
            evaluateAssignment(JSON.stringify(value));
        }
        else{//Single select
            evaluateAssignment(`'${(contextElement as HTMLSelectElement).value}'`);
        }
    };

    let putValue = (value: any) => {
        if (hotValue){//Ignore changes
            return;
        }

        if (!isCheckable && (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement)){
            contextElement.value = ToString(value);
        }
        else if (isCheckable && !isRadio){
            if (Array.isArray(value)){//Add value to array
                (contextElement as HTMLInputElement).checked = value.includes(transformData((contextElement as HTMLInputElement).value));
            }
            else{
                (contextElement as HTMLInputElement).checked = !!value;
            }
        }
        else if (isRadio){
            (contextElement as HTMLInputElement).checked = IsEqual(transformData(value), transformData((contextElement as HTMLInputElement).value));
        }
        else if ((contextElement as HTMLSelectElement).multiple){//Retrieve all selected
            if (Array.isArray(value)){//Value must be an array
                Array.from((contextElement as HTMLSelectElement).options).forEach(opt => (opt.selected = value.includes(transformData(opt.value))));
            }
        }
        else{//Single select
            (contextElement as HTMLSelectElement).value = ToString(value);
        }
    };
    
    let event = ((options.lazy || isCheckable || contextElement instanceof HTMLSelectElement) ? 'change' : 'input'), onEvent = () => {
        assign();
        if (!hotValue){
            hotValue = true;
            FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => (hotValue = false));
        }
    };

    contextElement.addEventListener(event, onEvent);
    if (isRadio && !contextElement.getAttribute('name')){//Set name
        contextElement.setAttribute('name', expression.trim());
    }

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => (ref = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(value => putValue(ref = value)),
    });
});

export function ModelDirectiveHandlerCompact(){
    AddDirectiveHandler(ModelDirectiveHandler);
}
