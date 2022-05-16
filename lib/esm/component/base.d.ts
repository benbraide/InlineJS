import { IntersectionObserver } from "../observers/intersection/base";
import { IComponent, IComponentBackend } from "../types/component";
import { ReactiveStateType } from "../types/config";
import { IElementScope } from "../types/element-scope";
import { IIntersectionObserver } from "../types/intersection";
import { IProxy } from "../types/proxy";
import { IRootElement } from "../types/root-element";
import { IScope } from "../types/scope";
import { ISelectionStackEntry } from "../types/selection";
export declare class BaseComponent implements IComponent {
    private id_;
    private root_;
    private reactiveState_;
    private name_;
    private context_;
    private changes_;
    private scopes_;
    private elementScopes_;
    private rootProxy_;
    private proxies_;
    private refs_;
    private currentScope_;
    private selectionScopes_;
    private uniqueMarkers_;
    private observers_;
    constructor(id_: string, root_: HTMLElement);
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
    CreateIntersectionObserver(options?: IntersectionObserverInit): IntersectionObserver;
    FindIntersectionObserver(id: string): IIntersectionObserver | null;
    RemoveIntersectionObserver(id: string): void;
    GetBackend(): IComponentBackend;
}
