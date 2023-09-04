import { IChanges } from "./changes";
import { ReactiveStateType } from "./config";
import { IContext } from "./context";
import { IElementScope } from "./element-scope";
import { IGlobal } from "./global";
import { IIntersectionObserver } from "./intersection";
import { IMutationObserverAttributeInfo } from "./mutation";
import { IProxy } from "./proxy";
import { IRootElement } from "./root-element";
import { IScope } from "./scope";
import { ISelectionStackEntry } from "./selection";
export interface IComponentBackend {
    context: IContext;
    changes: IChanges;
}
export interface IComponent {
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
    FindElement(deepestElement: HTMLElement, predicate: (element: HTMLElement) => boolean): HTMLElement | null;
    FindAncestor(target: HTMLElement, index?: number): HTMLElement | null;
    CreateElementScope(element: HTMLElement): IElementScope | null;
    RemoveElementScope(id: string): void;
    FindElementScope(element: HTMLElement | string | true | IRootElement): IElementScope | null;
    FindElementLocal(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean): IElementScope | null;
    FindElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean): any;
    SetElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, value: any): void;
    DeleteElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string): void;
    AddProxy(proxy: IProxy): void;
    RemoveProxy(proxy: IProxy | string): void;
    GetRootProxy(): IProxy;
    FindProxy(path: string): IProxy | null;
    AddRefElement(ref: string, element: HTMLElement): void;
    FindRefElement(ref: string): HTMLElement | null;
    GetRefElements(): Record<string, HTMLElement>;
    AddAttributeChangeCallback(element: HTMLElement, callback: (list: Array<IMutationObserverAttributeInfo>) => void): void;
    RemoveAttributeChangeCallback(element: HTMLElement, callback?: (nlist: Array<IMutationObserverAttributeInfo>) => void): void;
    AddIntersectionObserver(observer: IIntersectionObserver): void;
    FindIntersectionObserver(id: string): IIntersectionObserver | null;
    RemoveIntersectionObserver(id: string): void;
    GetBackend(): IComponentBackend;
    GetGlobal(): IGlobal;
}
export interface IElementScopeCreatedCallbackParams {
    componentId: string;
    component: IComponent | null;
    scope: IElementScope;
}
