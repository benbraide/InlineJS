"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitControl = void 0;
const find_1 = require("../../../component/find");
const evaluate_later_1 = require("../../../evaluator/evaluate-later");
const error_1 = require("../../../journal/error");
const effect_1 = require("../../../reactive/effect");
function InitControl({ componentId, component, contextElement, expression, originalView }) {
    let resolvedComponent = (component || (0, find_1.FindComponentById)(componentId));
    if (!resolvedComponent || resolvedComponent.GetRoot() === contextElement) {
        (0, error_1.JournalError)('Target is component root.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (!(contextElement instanceof HTMLTemplateElement)) {
        (0, error_1.JournalError)('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (contextElement.content.children.length > 1) {
        (0, error_1.JournalError)('Target must have a single child.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
    return {
        checkpoint: 0,
        parent: contextElement.parentElement,
        blueprint: contextElement.content.firstElementChild,
        effect: (handler) => (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate(handler),
        }),
        clone: () => contextElement.content.firstElementChild.cloneNode(true),
    };
}
exports.InitControl = InitControl;
