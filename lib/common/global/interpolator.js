"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpolate = exports.GetElementContent = void 0;
const find_1 = require("../component/find");
const evaluate_later_1 = require("../evaluator/evaluate-later");
const effect_1 = require("../reactive/effect");
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateBlockRegex = /\{%(.+?)%\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
const InterpolateBlockTestRegex = /\{%.+?%\}/;
function GetElementContent(el) {
    let computeContent = (node) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(child) : (child.textContent || ''))}`, '');
    };
    let computeText = (node) => {
        let tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };
    return computeContent(el);
}
exports.GetElementContent = GetElementContent;
function Interpolate({ componentId, contextElement, text, handler }) {
    var _a;
    let resolvedtext = '';
    if (!text) {
        let passesTest = (text) => (InterpolateInlineTestRegex.test(text) || InterpolateBlockTestRegex.test(text));
        if (![...contextElement.childNodes].filter(child => (child.nodeType == 3)).find(child => passesTest(child.textContent || ''))) {
            return;
        }
        resolvedtext = GetElementContent(contextElement);
    }
    else if (!InterpolateInlineTestRegex.test(text) && !InterpolateBlockTestRegex.test(text)) {
        return;
    }
    let replace = () => JSON.stringify(resolvedtext || text).replace(InterpolateInlineRegex, '"+($1)+"').replace(InterpolateBlockRegex, '";$1\noutput+="');
    let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement,
        expression: "let output = " + replace() + "; return output;",
    });
    (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement);
    (0, effect_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(handler),
    });
}
exports.Interpolate = Interpolate;
