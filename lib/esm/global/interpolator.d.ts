export interface IInterpolateParams {
    componentId: string;
    contextElement: HTMLElement;
    text?: string;
    handler?: (value: string) => void;
}
export interface IInterpolateTextParams {
    componentId: string;
    contextElement: HTMLElement;
    text: string;
    handler: (value: string) => void;
}
export declare function GetElementContent(el: Element): any;
export interface IInterpolateTextNode {
    text: string;
    evaluated: string;
}
export declare function ReplaceText({ componentId, contextElement, text, handler }: IInterpolateTextParams): void;
export declare function InterpolateText({ text, ...rest }: IInterpolateTextParams): void;
export declare function Interpolate({ componentId, contextElement, text, handler }: IInterpolateParams): void;
