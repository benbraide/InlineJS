/**
 * Interface for interpolation parameters.
 */
export interface IInterpolateParams {
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
export interface IInterpolateTextParams {
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
 * Scans an element's direct child text nodes for interpolation syntax (`{{...}}`) and replaces them with reactive text nodes.
 * This will not recurse into child elements.
 * @param componentId - The ID of the component
 * @param contextElement - The element whose content will be interpolated
 * @param text - Optional text to interpolate. If provided, it will be handled by `InterpolateText`.
 * @param handler - Optional handler for when `text` is provided.
 * @param testRegex - Optional regex to test for interpolation
 * @param matchRegex - Optional regex to match interpolation
 */
export declare function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams): void;
