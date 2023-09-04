export interface IResizeObserverHandlerParams {
    entry?: ResizeObserverEntry;
    observer?: globalThis.ResizeObserver;
}
export declare type ResizeObserverHandlerType = (params?: IResizeObserverHandlerParams) => void;
export interface IResizeObserver {
    GetNative(): globalThis.ResizeObserver | null;
    Observe(target: Element, handler: ResizeObserverHandlerType, options?: ResizeObserverOptions): void;
    Unobserve(target: Element): void;
}
