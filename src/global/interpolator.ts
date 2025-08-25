import { FindComponentById } from "../component/find";
import { EvaluateLater } from "../evaluator/evaluate-later";
import { GeneratedFunctionType } from "../evaluator/generate-function";
import { UseEffect } from "../reactive/effect";
import { EncodeValue } from "../utilities/encode-value";

/**
 * Interface for interpolation parameters
 */
export interface IInterpolateParams{
    componentId: string;
    contextElement: HTMLElement;
    text?: string;
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
 * Interface for text interpolation parameters
 */
export interface IInterpolateTextParams{
    componentId: string;
    contextElement: HTMLElement;
    text: string;
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
 * Utility to serialize an element's content to an HTML string. Not currently used by the interpolation system.
 * @param el - The element to get content from
 * @returns An HTML string representing the element's content
 */
export function GetElementContent(el: Element){
    const computeContent = (node: Element) => {
        return [...node.childNodes].reduce((prev, child) => `${prev}${((child.nodeType != 3) ? computeText(<Element>child) : (child.textContent || ''))}`, '');
    }

    const computeText = (node: Element) => {
        const tag = ([...node.attributes].reduce((prev, attr) => `${prev} ${attr.name}="${attr.value}"`, `<${node.tagName.toLowerCase()}`) + '>');
        return `${tag}${computeContent(node)}</${node.tagName.toLowerCase()}>`;
    };

    return computeContent(el);
}

/**
 * @deprecated This interface is no longer used by the current interpolation implementation.
 */
export interface IInterpolateTextNode{
    text: string;
    evaluated: string;
}

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

    if (evaluate){
        FindComponentById(componentId)?.CreateElementScope(contextElement);
        UseEffect({ componentId, contextElement,
            callback: () => evaluate(injectedHandler || handler),
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
 * Scans an element's child nodes for text content with interpolation syntax (`{{...}}`) and replaces it with reactive text nodes.
 * This function is the entry point for interpolating an element's entire content.
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
    
    if (!(testRegex || matchRegex || InterpolateInlineTestRegex).test(contextElement.textContent || '')) {
        return;
    }

    /**
     * Recursively scans a node and its children for text nodes to interpolate.
     * @param node - The node to scan
     */
    const scan = (node: Node, ctx: HTMLElement) => {
        if (node.nodeType === 3 && node.textContent && InterpolateInlineTestRegex.test(node.textContent)) {
            const text = node.textContent;
            const matches = [...text.matchAll(InterpolateInlineRegex)];
            
            if (matches.length === 0) {
                return;
            }

            // Create a document fragment to hold the new nodes
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            matches.forEach((match) => {
                const expression = match[1];
                const staticText = text.substring(lastIndex, match.index);

                if (staticText) {
                    fragment.appendChild(document.createTextNode(staticText));
                }

                // Create a placeholder text node that will be reactively updated
                const placeholder = document.createTextNode('');
                fragment.appendChild(placeholder);

                ReplaceText({ componentId, contextElement: ctx, text: `{{${expression}}}`, handler: (value) => {
                    // Update the placeholder's content when the expression value changes
                    placeholder.textContent = value;
                }});

                lastIndex = (match.index || 0) + match[0].length;
            });

            const remainingText = text.substring(lastIndex);
            if (remainingText) {
                fragment.appendChild(document.createTextNode(remainingText));
            }

            // Replace the original text node with the new fragment
            node.parentNode?.replaceChild(fragment, node);
        }
        else if (node instanceof HTMLElement && node.childNodes.length > 0) {
            [...node.childNodes].forEach(child => scan(child, node));
        }
    };

    // Start scanning from the context element's direct children
    [...contextElement.childNodes].forEach(child => scan(child, contextElement));
}
