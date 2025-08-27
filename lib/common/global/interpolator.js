"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpolate = exports.InterpolateText = exports.TraverseInterpolationReplacements = void 0;
const find_1 = require("../component/find");
const evaluate_later_1 = require("../evaluator/evaluate-later");
const effect_1 = require("../reactive/effect");
const encode_value_1 = require("../utilities/encode-value");
const range_1 = require("../utilities/range");
const to_string_1 = require("../utilities/to-string");
const get_1 = require("./get");
const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;
function TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex, callback) {
    const matches = [...text.matchAll(matchRegex)];
    if (matches.length === 0) {
        callback(0, text, (0, get_1.GetGlobal)().CreateNothing(), '');
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
        (0, effect_1.UseEffect)({ componentId, contextElement,
            callback: () => {
                let checkpoint = 0;
                (0, evaluate_later_1.EvaluateLater)({ componentId, contextElement, expression })((value) => {
                    const myCheckpoint = ++checkpoint;
                    (0, range_1.ConsiderRange)(value, (val) => {
                        if (myCheckpoint !== checkpoint)
                            return false;
                        callback(index, isFirstCall ? before : '', val, isFirstCall ? remainingText : '');
                        isFirstCall = false;
                    });
                });
            },
            cancelCallback: (cancel) => cancelEffect = cancel,
        });
        (_b = (_a = (0, find_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => cancelEffect === null || cancelEffect === void 0 ? void 0 : cancelEffect());
    });
}
exports.TraverseInterpolationReplacements = TraverseInterpolationReplacements;
/**
 * Reactively interpolates a string containing `{{...}}` syntax, calling a handler with the updated string.
 * @param params - The interpolation parameters
 */
function InterpolateText({ componentId, contextElement, text, testRegex, matchRegex, storeObject, handler }) {
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
            if ((0, get_1.GetGlobal)().IsNothing(value)) {
                parts.push('');
            }
            else {
                parts.push(storeObject ? (0, encode_value_1.EncodeValue)(value, componentId, contextElement) : (0, to_string_1.ToString)(value));
            }
            parts.push(after);
            initializedCount++;
            if (initializedCount === matchCount) {
                handler(parts.join(''));
            }
        }
        else {
            parts[localIndex + 1] = storeObject ? (0, encode_value_1.EncodeValue)(value, componentId, contextElement) : (0, to_string_1.ToString)(value);
            handler(parts.join(''));
        }
    });
}
exports.InterpolateText = InterpolateText;
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
function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }) {
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
                if (!(0, get_1.GetGlobal)().IsNothing(value)) {
                    if (index >= placeholders.length) {
                        const placeholder = document.createTextNode('');
                        fragment.appendChild(placeholder);
                        placeholder.textContent = (0, to_string_1.ToString)(value);
                        placeholders.push(placeholder);
                    }
                    else {
                        placeholders[index].textContent = (0, to_string_1.ToString)(value);
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
exports.Interpolate = Interpolate;
