var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";
import { ConsiderRange } from "../utilities/range";
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
/**
 * Replaces the given text with its evaluated value, setting up a reactive effect to keep it updated.
 * @param componentId - The ID of the component
 * @param contextElement - The element to use as context for evaluation
 * @param text - The text containing interpolation syntax
 * @param handler - A callback to handle the evaluated value
 * @param testRegex - Optional regex to test for interpolation
 * @param matchRegex - Optional regex to match interpolation
 * @param storeObject - If true, treats the entire text as a single expression and stores the resulting object
 */
export function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }) {
    var _a;
    let evaluate = null, injectedHandler = null;
    if (storeObject) {
        const trimmedtext = text.trim();
        let match = (trimmedtext.match(testRegex || InterpolateInlineTestRegex) || [])[0];
        if (match && match === trimmedtext) {
            match = match.replace((matchRegex || InterpolateInlineRegex), '$1').trim();
            evaluate = match ? EvaluateLater({ componentId, contextElement,
                expression: `return (${match});`,
                voidOnly: true,
            }) : (handler => (handler && handler('')));
            injectedHandler = value => handler(EncodeValue(value, componentId, contextElement));
        }
    }
    if (!evaluate) {
        text = JSON.stringify(text).replace((matchRegex || InterpolateInlineRegex), '"+($1)+"').replace(/"\+\(\s*\)\+"/g, '');
        evaluate = EvaluateLater({ componentId, contextElement,
            expression: `const output = ${text}; return output;`,
        });
    }
    let checkpoint = 0;
    if (evaluate) {
        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement);
        UseEffect({
            componentId, contextElement,
            callback: () => evaluate((value) => {
                const myCheckpoint = ++checkpoint;
                ConsiderRange(value, (val) => {
                    var _a;
                    if (myCheckpoint !== checkpoint)
                        return false;
                    (_a = (injectedHandler || handler)) === null || _a === void 0 ? void 0 : _a(val);
                });
            }),
        });
    }
}
/**
 * A wrapper around `ReplaceText` that first tests if the text contains interpolation syntax before processing.
 * @param params - The interpolation parameters
 */
export function InterpolateText(_a) {
    var { text, testRegex, matchRegex } = _a, rest = __rest(_a, ["text", "testRegex", "matchRegex"]);
    if ((testRegex || matchRegex || InterpolateInlineTestRegex).test(text)) {
        ReplaceText(Object.assign({ text, testRegex, matchRegex }, rest));
    }
}
/**
 * Scans an element's direct child text nodes for interpolation syntax (`{{...}}`) and replaces them with reactive text nodes.
 * This will not recurse into child elements.
 * @param componentId - The ID of the component
 * @param contextElement - The element whose content will be interpolated
 * @param text - Optional text to interpolate. If provided, it will be handled by `InterpolateText`.
 * @param handler - Optional handler for when `text` is provided.
 * @param testRegex - Optional regex to test for interpolation
 * @param matchRegex - Optional regex to match interpolation
 */
export function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }) {
    if (typeof text === 'string') {
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }
    /**
     * Processes a single node, replacing it with interpolated content if it's a matching text node.
     * @param node - The node to process
     */
    const processNode = (node) => {
        var _a;
        if (node.nodeType === Node.TEXT_NODE && node.textContent && (testRegex || InterpolateInlineTestRegex).test(node.textContent)) {
            const text = node.textContent;
            const matches = [...text.matchAll(matchRegex || InterpolateInlineRegex)];
            if (matches.length === 0) {
                return;
            }
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;
            matches.forEach((match) => {
                const expression = match[1];
                const staticText = text.substring(lastIndex, match.index);
                if (staticText) {
                    fragment.appendChild(document.createTextNode(staticText));
                }
                const placeholder = document.createTextNode('');
                fragment.appendChild(placeholder);
                ReplaceText({ componentId, contextElement, text: `{{ ${expression} }}`, handler: (value) => {
                        placeholder.textContent = value;
                    } });
                lastIndex = (match.index || 0) + match[0].length;
            });
            const remainingText = text.substring(lastIndex);
            if (remainingText) {
                fragment.appendChild(document.createTextNode(remainingText));
            }
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(fragment, node);
        }
    };
    // Process only the context element's direct children
    [...contextElement.childNodes].forEach(processNode);
}
