import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { GeneratedFunctionType } from "../evaluator/generate-function";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";
import { ConsiderRange } from "../utilities/range";

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
export function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }: IInterpolateTextParams){
    let evaluate: GeneratedFunctionType | null = null, injectedHandler: ((value: any) => void) | null = null;
    if (storeObject){
        const trimmedtext = text.trim();
        let match = (trimmedtext.match(testRegex || InterpolateInlineTestRegex) || [])[0];
        if (match && match === trimmedtext){
            match = match.replace((matchRegex || InterpolateInlineRegex), '$1').trim();
            evaluate = match ? EvaluateLater({ componentId, contextElement,
                expression: `return (${match});`,
                voidOnly: true,
            }) : (handler => (handler && handler('')));
            injectedHandler = value => handler(EncodeValue(value, componentId, contextElement));
        }
    }
    
    if (!evaluate){
        text = JSON.stringify(text).replace((matchRegex || InterpolateInlineRegex), '"+($1)+"').replace(/"\+\(\s*\)\+"/g, '');
        evaluate = EvaluateLater({ componentId, contextElement,
            expression: `const output = ${text}; return output;`,
        });
    }

    let checkpoint = 0;
    if (evaluate){
        FindComponentById(componentId)?.CreateElementScope(contextElement);
        UseEffect({
            componentId, contextElement,
            callback: () => evaluate((value) => {
                const myCheckpoint = ++checkpoint;
                ConsiderRange(value, (val) => {
                    if (myCheckpoint !== checkpoint) return false;
                    (injectedHandler || handler)?.(val);
                });
            }),
        });
    }
}

/**
 * A wrapper around `ReplaceText` that first tests if the text contains interpolation syntax before processing.
 * @param params - The interpolation parameters
 */
export function InterpolateText({ text, testRegex, matchRegex, ...rest }: IInterpolateTextParams){
    if ((testRegex || matchRegex || InterpolateInlineTestRegex).test(text)) {
        ReplaceText({ text, testRegex, matchRegex, ...rest });
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
export function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams){
    if (typeof text === 'string') {
        return (handler && InterpolateText({ componentId, contextElement, text, handler, testRegex, matchRegex }));
    }

    /**
     * Processes a single node, replacing it with interpolated content if it's a matching text node.
     * @param node - The node to process
     */
    const processNode = (node: Node) => {
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
                }});

                lastIndex = (match.index || 0) + match[0].length;
            });
 
            const remainingText = text.substring(lastIndex);
            if (remainingText) {
                fragment.appendChild(document.createTextNode(remainingText));
            }

            node.parentNode?.replaceChild(fragment, node);
        }
    };

    // Process only the context element's direct children
    [...contextElement.childNodes].forEach(processNode);
}

