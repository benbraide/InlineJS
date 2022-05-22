export interface IInterpolateParams {
    componentId: string;
    contextElement: HTMLElement;
    handler: (value: string) => void;
    text?: string;
}
export declare function GetElementContent(el: Element): any;
export declare function Interpolate({ componentId, contextElement, text, handler }: IInterpolateParams): void;
