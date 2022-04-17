import { IIntersectionObserver, IntersectionObserverHandlerType } from "../../types/intersection";
export declare class IntersectionObserver implements IIntersectionObserver {
    private id_;
    private observer_;
    private handlers_;
    constructor(id_: string, options: IntersectionObserverInit);
    GetId(): string;
    GetNative(): globalThis.IntersectionObserver | null;
    Observe(target: Element, handler: IntersectionObserverHandlerType): void;
    Unobserve(target: Element): void;
}
