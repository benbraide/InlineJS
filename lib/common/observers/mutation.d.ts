import { IMutationObserver, IMutationType, MutationObserverHandlerType } from "../types/mutation";
export declare class MutationObserver implements IMutationObserver {
    private uniqueMarkers_;
    private observer_;
    private handlers_;
    constructor();
    GetNative(): globalThis.MutationObserver | null;
    Observe(target: Node, handler: MutationObserverHandlerType, whitelist?: Array<IMutationType>): string;
    Unobserve(target: Node | string): void;
}
