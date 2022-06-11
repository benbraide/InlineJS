import { IProxy } from "./proxy";
export interface IScope {
    GetComponentId(): string;
    GetId(): string;
    SetName(name: string): void;
    GetName(): string;
    GetRoot(): HTMLElement;
    GetProxy(): IProxy;
    FindElement(deepestElement: HTMLElement, predicate: (element?: HTMLElement) => boolean): HTMLElement | null;
    FindAncestor(target: HTMLElement, index?: number): HTMLElement | null;
}
