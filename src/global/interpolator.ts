import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";
import { ConsiderRange } from "../utilities/range";
import { ToString } from "../utilities/to-string";
import { GetGlobal } from "./get";

/**
 * Interface for interpolation parameters.
 */
export interface IInterpolateParams{
    /**
     * The ID of the component that owns the interpolation.
     */
    componentId: string;
    /**
     * The HTML element that serves as the context for the interpolation.
     */
    contextElement: HTMLElement;
    /**
     * Optional text to interpolate. If not provided, the function will scan the element's child nodes.
     */
    text?: string;
    /**
     * Optional callback to handle the interpolated value.
     */
    handler?: (value: string) => void;
    /**
     * Optional regex to use for matching interpolation syntax. Defaults to `InterpolateInlineRegex`.
     */
    matchRegex?: RegExp;
    /**
     * Optional regex to use for testing for interpolation syntax. Defaults to `InterpolateInlineTestRegex`.
     */
    testRegex?: RegExp;
}

/**
 * Interface for text interpolation parameters.
 */
export interface IInterpolateTextParams{
    /**
     * The ID of the component that owns the interpolation.
     */
    componentId: string;
    /**
     * The HTML element that serves as the context for the interpolation.
     */
    contextElement: HTMLElement;
    /**
     * The text containing interpolation syntax.
     */
    text: string;
    /**
     * A callback to handle the evaluated value.
     */
    handler: (value: string) => void;
    /**
     * Optional regex to use for matching interpolation syntax. Defaults to `InterpolateInlineRegex`.
     */
    matchRegex?: RegExp;
    /**
     * Optional regex to use for testing for interpolation syntax. Defaults to `InterpolateInlineTestRegex`.
     */
    testRegex?: RegExp;
    /**
     * If true, treats the entire text as a single expression and stores the resulting object instead of stringifying it.
     */
    storeObject?: boolean;
}

const InterpolateInlineRegex = /\{\{\s*(.+?)\s*\}\}/g;
const InterpolateInlineTestRegex = /\{\{.+?\}\}/;

export function TraverseInterpolationReplacements(componentId: string, contextElement: HTMLElement, text: string, matchRegex: RegExp, callback: (index: number, before: string, value: any, after: string) => void){
    const matches = [...text.matchAll(matchRegex)];
    if (matches.length === 0) {
        callback(0, text, GetGlobal().CreateNothing(), '');
        return;
    }

    let lastIndex = 0;
    
    matches.forEach((match, index) => {
        const expression = match[1];
        const before = text.substring(lastIndex, match.index);

        lastIndex = (match.index || 0) + match[0].length;
        
        const remainingText = index < matches.length - 1 ? '' : text.substring(lastIndex);
        let isFirstCall = true, cancelEffect: (() => void) | null = null;
        
        UseEffect({ componentId, contextElement,
            callback: () => {
                let checkpoint = 0;
                EvaluateLater({ componentId, contextElement, expression })((value) => {
                    const myCheckpoint = ++checkpoint;
                    ConsiderRange(value, (val) => {
                        if (myCheckpoint !== checkpoint) return false;

                        callback(index, isFirstCall ? before : '', val, isFirstCall ? remainingText : '');
                        isFirstCall = false;
                    });
                });
            },
            cancelCallback: (cancel) => cancelEffect = cancel,
        });
        
        FindComponentById(componentId)?.FindElementScope(contextElement)?.AddUninitCallback(() => cancelEffect?.());
    });
}

/**
 * Reactively interpolates a string containing `{{...}}` syntax, calling a handler with the updated string.
 * @param params - The interpolation parameters
 */
export function InterpolateText({ componentId, contextElement, text, testRegex, matchRegex, storeObject, handler }: IInterpolateTextParams){
    if (!(testRegex || InterpolateInlineTestRegex).test(text)){
        return handler(text);
    }
    
    const matchCount = [...text.matchAll(matchRegex || InterpolateInlineRegex)].length;
    if (matchCount === 0) { // Should be caught by testRegex, but for safety
        return handler(text);
    }

    const parts = new Array<string>();
    let initializedCount = 0;
    
    TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex || InterpolateInlineRegex, (index, before, value, after) => {
        const localIndex = index * 3;

        if (localIndex >= parts.length){
            parts.push(before);
        
            if (GetGlobal().IsNothing(value)){
                parts.push('');
            }
            else{
                parts.push(storeObject ? EncodeValue(value, componentId, contextElement) : ToString(value));
            }
            
            parts.push(after);

            initializedCount++;
            if (initializedCount === matchCount) {
                handler(parts.join(''));
            }
        }
        else{
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
export function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams){
    if (typeof text === 'string') {
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }

    /**
     * Processes a single node, replacing it with interpolated content if it's a matching text node.
     * @param node - The node to process
     */
    const processNode = (node: Node) => {
        if (node.parentNode && node.nodeType === Node.TEXT_NODE && node.textContent && (testRegex || InterpolateInlineTestRegex).test(node.textContent)) {
            const text = node.textContent;
            const fragment = document.createDocumentFragment();
            const placeholders = new Array<Text>();

            TraverseInterpolationReplacements(componentId, contextElement, text, matchRegex || InterpolateInlineRegex, (index, before, value, after) => {
                before && fragment.appendChild(document.createTextNode(before));

                if (!GetGlobal().IsNothing(value)){
                    if (index >= placeholders.length){
                        const placeholder = document.createTextNode('');
                        fragment.appendChild(placeholder);
                        placeholder.textContent = ToString(value);
                        placeholders.push(placeholder);
                    }
                    else{
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
