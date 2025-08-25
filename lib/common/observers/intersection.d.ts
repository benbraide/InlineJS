import { IIntersectionObserver, IntersectionObserverHandlerType } from "../types/intersection";
import { IIntersectionOptions } from "./intersection-options";
export declare class IntersectionObserver implements IIntersectionObserver {
    private id_;
    private observer_;
    private handlers_;
    constructor(id_: string, options: IIntersectionOptions);
    GetId(): string;
    GetNative(): globalThis.IntersectionObserver | null;
    Observe(target: Element, handler: IntersectionObserverHandlerType): void;
    Unobserve(target: Element): void;
    Destroy(): void;
}
