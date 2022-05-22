import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { UseEffect } from "../reactive/effect";
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateBlockRegex = /\{%(.+?)%\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
const InterpolateBlockTestRegex = /\{%.+?%\}/;
export function GetElementContent(el) {
    let computeContent = (node) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(child) : (child.textContent || ''))}`, '');
    };
    let computeText = (node) => {
        let tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };
    return computeContent(el);
}
export function Interpolate({ componentId, contextElement, text, handler }) {
    var _a;
    let resolvedtext;
    if (!text) {
        let passesTest = (text) => (InterpolateInlineTestRegex.test(text) || InterpolateBlockTestRegex.test(text));
        if (![...contextElement.childNodes].filter(child => (child.nodeType == 3)).find(child => passesTest(child.textContent || ''))) {
            return;
        }
        resolvedtext = GetElementContent(contextElement);
    }
    else if (!InterpolateInlineTestRegex.test(text) && !InterpolateInlineTestRegex.test(resolvedtext = text)) {
        return;
    }
    let replace = () => JSON.stringify(resolvedtext).replace(InterpolateInlineRegex, '"+($1)+"').replace(InterpolateBlockRegex, '";$1\noutput+="');
    let evaluate = EvaluateLater({ componentId, contextElement,
        expression: "let output = " + replace() + "; return output;",
    });
    (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement);
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(handler),
    });
}
