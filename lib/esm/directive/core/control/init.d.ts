import { IDirectiveHandlerParams } from "../../../types/directives";
export declare function InitControl({ componentId, component, contextElement, expression, originalView }: IDirectiveHandlerParams): {
    checkpoint: number;
    parent: HTMLElement;
    blueprint: HTMLElement;
    effect: (handler: (value: any) => void) => void;
    clone: () => HTMLElement;
} | null;
