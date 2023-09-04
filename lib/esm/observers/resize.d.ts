import { IResizeObserver, ResizeObserverHandlerType } from "../types/resize-observer";
export declare class ResizeObserver implements IResizeObserver {
    private observer_;
    private handlers_;
    constructor();
    GetNative(): globalThis.ResizeObserver | null;
    Observe(target: Element, handler: ResizeObserverHandlerType, options?: ResizeObserverOptions): void;
    Unobserve(target: Element): void;
}
