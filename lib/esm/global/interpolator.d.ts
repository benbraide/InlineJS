/**
 * Interface for interpolation parameters
 */
export interface IInterpolateParams {
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
export interface IInterpolateTextParams {
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
/**
 * Utility to serialize an element's content to an HTML string. Not currently used by the interpolation system.
 * @param el - The element to get content from
 * @returns An HTML string representing the element's content
 */
export declare function GetElementContent(el: Element): any;
/**
 * @deprecated This interface is no longer used by the current interpolation implementation.
 */
export interface IInterpolateTextNode {
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
export declare function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }: IInterpolateTextParams): void;
/**
 * A wrapper around `ReplaceText` that first tests if the text contains interpolation syntax before processing.
 * @param params - The interpolation parameters
 */
export declare function InterpolateText({ text, testRegex, matchRegex, ...rest }: IInterpolateTextParams): void;
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
export declare function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams): void;
