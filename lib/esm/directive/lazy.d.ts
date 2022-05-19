import { IDirectiveHandlerParams } from "../types/directive";
export interface ILazyOptions {
    lazy: boolean;
    ancestor: number;
    threshold: number;
}
export interface ILazyParams extends IDirectiveHandlerParams {
    callback: (data?: any) => void;
    options?: ILazyOptions;
    defaultOptionValue?: number;
    useEffect?: boolean;
}
export declare function LazyCheck({ componentId, component, contextElement, expression, argOptions, callback, options, defaultOptionValue, useEffect }: ILazyParams): void;
