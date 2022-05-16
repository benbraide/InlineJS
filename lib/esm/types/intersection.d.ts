export interface IIntersectionObserverHandlerParams {
    id?: string;
    entry?: IntersectionObserverEntry;
    observer?: globalThis.IntersectionObserver;
}
export declare type IntersectionObserverHandlerType = (params?: IIntersectionObserverHandlerParams) => void;
export interface IIntersectionObserver {
    GetId(): string;
    GetNative(): globalThis.IntersectionObserver | null;
    Observe(target: Element, handler: IntersectionObserverHandlerType): void;
    Unobserve(target: Element): void;
}
