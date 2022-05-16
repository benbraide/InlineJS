"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDirectiveHandlerCompact = exports.ModelDirectiveHandler = void 0;
const find_1 = require("../../../component/find");
const add_1 = require("../../../directives/add");
const callback_1 = require("../../../directives/callback");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const effect_1 = require("../../../reactive/effect");
const is_equal_1 = require("../../../utilities/is-equal");
const to_string_1 = require("../../../utilities/to-string");
const options_1 = require("../../options");
exports.ModelDirectiveHandler = (0, callback_1.CreateDirectiveHandlerCallback)('model', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression }), options = (0, options_1.ResolveOptions)({
        options: {
            lazy: false,
            number: false,
            forced: false,
            trim: false,
        },
        list: argOptions,
    });
    let transformData = (data) => {
        let transformed = (options.number ? parseFloat((0, to_string_1.ToString)(data)) : null);
        return ((transformed || transformed === 0) ? transformed : ((options.number && options.forced) ? 0 : (options.trim ? (0, to_string_1.ToString)(data).trim() : data)));
    };
    let evaluateAssignment = (value) => {
        (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
            expression: `(${expression}) = (${value})`,
        })();
    };
    let isRadio = (contextElement instanceof HTMLInputElement && contextElement.type === 'radio');
    let isCheckable = (isRadio || (contextElement instanceof HTMLInputElement && contextElement.type === 'checkbox'));
    let ref = null, hotValue = false, assign = () => {
        if (!isCheckable && (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement)) {
            let transformed = transformData(contextElement.value);
            evaluateAssignment((typeof transformed === 'number') ? transformed : `'${(0, to_string_1.ToString)(transformed)}'`);
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
            evaluateAssignment(contextElement.checked ? ((typeof transformed === 'number') ? transformed : `'${(0, to_string_1.ToString)(transformed)}'`) : '');
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
            contextElement.value = (0, to_string_1.ToString)(value);
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
            contextElement.checked = (0, is_equal_1.IsEqual)(transformData(value), transformData(contextElement.value));
        }
        else if (contextElement.multiple) { //Retrieve all selected
            if (Array.isArray(value)) { //Value must be an array
                Array.from(contextElement.options).forEach(opt => (opt.selected = value.includes(transformData(opt.value))));
            }
        }
        else { //Single select
            contextElement.value = (0, to_string_1.ToString)(value);
        }
    };
    let event = ((options.lazy || isCheckable || contextElement instanceof HTMLSelectElement) ? 'change' : 'input'), onEvent = () => {
        var _a;
        assign();
        if (!hotValue) {
            hotValue = true;
            (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => (hotValue = false));
        }
    };
    contextElement.addEventListener(event, onEvent);
    if (isRadio && !contextElement.getAttribute('name')) { //Set name
        contextElement.setAttribute('name', expression.trim());
    }
    (_b = (_a = (component || (0, find_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => (ref = null));
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(value => putValue(ref = value)),
    });
});
function ModelDirectiveHandlerCompact() {
    (0, add_1.AddDirectiveHandler)(exports.ModelDirectiveHandler);
}
exports.ModelDirectiveHandlerCompact = ModelDirectiveHandlerCompact;
