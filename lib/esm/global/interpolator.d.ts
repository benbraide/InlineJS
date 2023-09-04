export interface IInterpolateParams {
    componentId: string;
    contextElement: HTMLElement;
    text?: string;
    handler?: (value: string) => void;
    matchRegex?: RegExp;
    testRegex?: RegExp;
}
export interface IInterpolateTextParams {
    componentId: string;
    contextElement: HTMLElement;
    text: string;
    handler: (value: string) => void;
    matchRegex?: RegExp;
    testRegex?: RegExp;
    storeObject?: boolean;
}
export declare function GetElementContent(el: Element): any;
export interface IInterpolateTextNode {
    text: string;
    evaluated: string;
}
export declare function ReplaceText({ componentId, contextElement, text, handler, testRegex, matchRegex, storeObject }: IInterpolateTextParams): void;
export declare function InterpolateText({ text, testRegex, matchRegex, ...rest }: IInterpolateTextParams): void;
export declare function Interpolate({ componentId, contextElement, text, handler, testRegex, matchRegex }: IInterpolateParams): void;
