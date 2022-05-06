export interface IInterpolateParams {
    componentId: string;
    contextElement: HTMLElement;
    handler: (value: string) => void;
    text?: string;
}
export declare function Interpolate({ componentId, contextElement, text, handler }: IInterpolateParams): void;
