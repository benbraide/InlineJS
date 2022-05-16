import { IScope } from "../types/scope";
export declare class Scope implements IScope {
    private componentId_;
    private id_;
    private root_;
    private name_;
    constructor(componentId_: string, id_: string, root_: HTMLElement);
    GetComponentId(): string;
    GetId(): string;
    SetName(name: string): void;
    GetName(): string;
    GetRoot(): HTMLElement;
    FindElement(deepestElement: HTMLElement, predicate: (element?: HTMLElement) => boolean): HTMLElement | null;
    FindAncestor(target: HTMLElement, index?: number): HTMLElement | null;
}
