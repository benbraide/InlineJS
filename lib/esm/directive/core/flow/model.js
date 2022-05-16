import { FindComponentById } from "../../../component/find";
import { AddDirectiveHandler } from "../../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../../directives/callback";
import { EvaluateLater } from "../../../evaluator/evaluate-later";
import { UseEffect } from "../../../reactive/effect";
import { IsEqual } from "../../../utilities/is-equal";
import { ToString } from "../../../utilities/to-string";
import { ResolveOptions } from "../../options";
export const ModelDirectiveHandler = CreateDirectiveHandlerCallback('model', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            lazy: false,
            number: false,
            forced: false,
            trim: false,
        },
        list: argOptions,
    });
    let transformData = (data) => {
        let transformed = (options.number ? parseFloat(ToString(data)) : null);
        return ((transformed || transformed === 0) ? transformed : ((options.number && options.forced) ? 0 : (options.trim ? ToString(data).trim() : data)));
    };
    let evaluateAssignment = (value) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${value})`,
        })();
    };
    let isRadio = (contextElement instanceof HTMLInputElement && contextElement.type === 'radio');
    let isCheckable = (isRadio || (contextElement instanceof HTMLInputElement && contextElement.type === 'checkbox'));
    let ref = null, hotValue = false, assign = () => {
        if (!isCheckable && (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement)) {
            let transformed = transformData(contextElement.value);
            evaluateAssignment((typeof transformed === 'number') ? transformed : `'${ToString(transformed)}'`);
        }
        else if (isCheckable && !isRadio) {
            if (Array.isArray(ref)) { //Add value to array
                let transformed = transformData(contextElement.value), index = ref.indexOf(transformed);
                if (index == -1 && contextElement.checked) {
                    ref.push(transformed);
                }
                else if (index != -1 && !contextElement.checked) {
                    ref.splice(index, 1);
                }
            }
            else {
                evaluateAssignment(contextElement.checked ? 'true' : 'false');
            }
        }
        else if (isRadio) {
            let transformed = transformData(contextElement.value);
            evaluateAssignment(contextElement.checked ? ((typeof transformed === 'number') ? transformed : `'${ToString(transformed)}'`) : '');
        }
        else if (contextElement.multiple) { //Retrieve all selected
            let value = Array.from(contextElement.selectedOptions).map(item => transformData(item.value));
            evaluateAssignment(JSON.stringify(value));
        }
        else { //Single select
            evaluateAssignment(`'${contextElement.value}'`);
        }
    };
    let putValue = (value) => {
        if (hotValue) { //Ignore changes
            return;
        }
        if (!isCheckable && (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement)) {
            contextElement.value = ToString(value);
        }
        else if (isCheckable && !isRadio) {
            if (Array.isArray(value)) { //Add value to array
                contextElement.checked = value.includes(transformData(contextElement.value));
            }
            else {
                contextElement.checked = !!value;
            }
        }
        else if (isRadio) {
            contextElement.checked = IsEqual(transformData(value), transformData(contextElement.value));
        }
        else if (contextElement.multiple) { //Retrieve all selected
            if (Array.isArray(value)) { //Value must be an array
                Array.from(contextElement.options).forEach(opt => (opt.selected = value.includes(transformData(opt.value))));
            }
        }
        else { //Single select
            contextElement.value = ToString(value);
        }
    };
    let event = ((options.lazy || isCheckable || contextElement instanceof HTMLSelectElement) ? 'change' : 'input'), onEvent = () => {
        var _a;
        assign();
        if (!hotValue) {
            hotValue = true;
            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => (hotValue = false));
        }
    };
    contextElement.addEventListener(event, onEvent);
    if (isRadio && !contextElement.getAttribute('name')) { //Set name
        contextElement.setAttribute('name', expression.trim());
    }
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => (ref = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(value => putValue(ref = value)),
    });
});
export function ModelDirectiveHandlerCompact() {
    AddDirectiveHandler(ModelDirectiveHandler);
}
