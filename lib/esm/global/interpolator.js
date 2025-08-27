import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";
import { ConsiderRange } from "../utilities/range";
import { ToString } from "../utilities/to-string";
import { GetGlobal } from "./get";
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
export function TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex, callback) {
    const matches = [...text.matchAll(matchRegex)];
    if (matches.length === 0) {
        callback(0, text, GetGlobal().CreateNothing(), '');
        return;
    }
    let lastIndex = 0;
    matches.forEach((match, index) => {
        var _a, _b;
        const expression = match[1];
        const before = text.substring(lastIndex, match.index);
        lastIndex = (match.index || 0) + match[0].length;
        const remainingText = index < matches.length - 1 ? '' : text.substring(lastIndex);
        let isFirstCall = true, cancelEffect = null;
        UseEffect({ componentId, contextElement,
            callback: () => {
                let checkpoint = 0;
                EvaluateLater({ componentId, contextElement, expression })((value) => {
                    const myCheckpoint = ++checkpoint;
                    ConsiderRange(value, (val) => {
                        if (myCheckpoint !== checkpoint)
                            return false;
                        callback(index, isFirstCall ? before : '', val, isFirstCall ? remainingText : '');
                        isFirstCall = false;
                    });
                });
            },
            cancelCallback: (cancel) => cancelEffect = cancel,
        });
        (_b = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => cancelEffect === null || cancelEffect === void 0 ? void 0 : cancelEffect());
    });
}
/**
 * Reactively interpolates a string containing `{{...}}` syntax, calling a handler with the updated string.
 * @param params - The interpolation parameters
 */
export function InterpolateText({ componentId, contextElement, text, testRegex, matchRegex, storeObject, handler }) {
    if (!(testRegex || InterpolateInlineTestRegex).test(text)) {
        return handler(text);
    }
    const matchCount = [...text.matchAll(matchRegex || InterpolateInlineRegex)].length;
    if (matchCount === 0) { // Should be caught by testRegex, but for safety
        return handler(text);
    }
    const parts = new Array();
    let initializedCount = 0;
    TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex || InterpolateInlineRegex, (index, before, value, after) => {
        const localIndex = index * 3;
        if (localIndex >= parts.length) {
            parts.push(before);
            if (GetGlobal().IsNothing(value)) {
                parts.push('');
            }
            else {
                parts.push(storeObject ? EncodeValue(value, componentId, contextElement) : ToString(value));
            }
            parts.push(after);
            initializedCount++;
            if (initializedCount === matchCount) {
                handler(parts.join(''));
            }
        }
        else {
            parts[localIndex + 1] = storeObject ? EncodeValue(value, componentId, contextElement) : ToString(value);
            handler(parts.join(''));
        }
    });
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
        if (node.parentNode && node.nodeType === Node.TEXT_NODE && node.textContent && (testRegex || InterpolateInlineTestRegex).test(node.textContent)) {
            const text = node.textContent;
            const fragment = document.createDocumentFragment();
            const placeholders = new Array();
            TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex || InterpolateInlineRegex, (index, before, value, after) => {
                before && fragment.appendChild(document.createTextNode(before));
                if (!GetGlobal().IsNothing(value)) {
                    if (index >= placeholders.length) {
                        const placeholder = document.createTextNode('');
                        fragment.appendChild(placeholder);
                        placeholder.textContent = ToString(value);
                        placeholders.push(placeholder);
                    }
                    else {
                        placeholders[index].textContent = ToString(value);
                    }
                }
                after && fragment.appendChild(document.createTextNode(after));
            });
            node.parentNode.replaceChild(fragment, node);
        }
    };
    // Process only the context element's direct children
    [...contextElement.childNodes].forEach(processNode);
}
