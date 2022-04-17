import { IChanges } from "./changes";
import { ReactiveStateType } from "./config";
import { IContext } from "./context";
import { IElementScope } from "./element-scope";
import { IIntersectionObserver } from "./intersection";
import { IProxy } from "./proxy";
import { IRootElement } from "./root-element";
import { IScope } from "./scope";
import { ISelectionStackEntry } from "./selection";

export interface IComponentBackend{
    context: IContext;
    changes: IChanges;
}

export interface IComponent{
    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;

    GetId(): string;
    GenerateUniqueId(prefix?: string, suffix?: string): string;

    SetName(name: string): void;
    GetName(): string;

    CreateScope(root: HTMLElement): IScope | null;
    RemoveScope(scope: IScope | string): void;

    FindScopeById(id: string): IScope | null;
    FindScopeByName(name: string): IScope | null;
    FindScopeByRoot(root: HTMLElement): IScope | null;

    PushCurrentScope(scopeId: string): void;
    PopCurrentScope(): string | null;
    PeekCurrentScope(): string | null;

    InferScopeFrom(element: HTMLElement | null): IScope | null;

    PushSelectionScope(): ISelectionStackEntry;
    PopSelectionScope(): ISelectionStackEntry | null;
    PeekSelectionScope(): ISelectionStackEntry | null;

    GetRoot(): HTMLElement;
    FindElement(deepestElement: HTMLElement, predicate: (element?: HTMLElement) => boolean): HTMLElement | null;
    FindAncestor(target: HTMLElement, index?: number): HTMLElement | null;

    CreateElementScope(element: HTMLElement): IElementScope | null;
    RemoveElementScope(id: string): void;

    FindElementScope(element: HTMLElement | string | true | IRootElement): IElementScope | null;
    FindElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean): any;

    AddProxy(proxy: IProxy): void;
    RemoveProxy(proxy: IProxy | string): void;
    
    GetRootProxy(): IProxy;
    FindProxy(path: string): IProxy | null;

    AddRefElement(ref: string, element: HTMLElement): void;
    FindRefElement(ref: string): HTMLElement | null;

    CreateIntersectionObserver(options?: IntersectionObserverInit): IIntersectionObserver;
    FindIntersectionObserver(id: string): IIntersectionObserver | null;
    RemoveIntersectionObserver(id: string): void;
    
    GetBackend(): IComponentBackend;
}
