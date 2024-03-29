export interface IMutationObserverAttributeInfo {
    name: string;
    target: Node;
}
export interface IMutationObserverHandlerParams {
    id: string;
    added?: Array<Node>;
    removed?: Array<Node>;
    attributes?: Array<IMutationObserverAttributeInfo>;
}
export declare type MutationObserverHandlerType = (params: IMutationObserverHandlerParams) => void;
export declare type IMutationType = 'add' | 'remove' | 'attribute';
export interface IMutationObserver {
    GetNative(): globalThis.MutationObserver | null;
    Observe(target: Node, handler: MutationObserverHandlerType, whitelist?: Array<IMutationType>): string;
    Unobserve(target: Node | string): void;
}
