import { RootProxy } from "../proxy/root";
import { Stack } from "../stack";
import { IChanges } from "../types/changes";
import { IComponent, IComponentBackend } from "../types/component";
import { ReactiveStateType } from "../types/config";
import { IElementScope } from "../types/element-scope";
import { IIntersectionObserver } from "../types/intersection";
import { IMutationObserverAttributeInfo } from "../types/mutation";
import { IProxy, IProxyAccessHandler } from "../types/proxy";
import { IRootElement } from "../types/root-element";
import { IScope } from "../types/scope";
import { ISelectionStackEntry } from "../types/selection";
import { ChangesMonitor } from "./changes-monitor";
import { Context } from "./context";
interface IAttributeObserverInfo {
    element: HTMLElement;
    callback: (list: Array<IMutationObserverAttributeInfo>) => void;
}
export declare class BaseComponent extends ChangesMonitor implements IComponent {
    protected id_: string;
    protected root_: HTMLElement;
    protected reactiveState_: ReactiveStateType;
    protected name_: string;
    protected proxyAccessHandler_: IProxyAccessHandler | null;
    protected context_: Context;
    protected changes_: IChanges;
    protected scopes_: Record<string, IScope>;
    protected elementScopes_: Record<string, IElementScope>;
    protected rootProxy_: RootProxy;
    protected proxies_: Record<string, IProxy>;
    protected refs_: Record<string, HTMLElement>;
    protected currentScope_: Stack<string>;
    protected selectionScopes_: Stack<ISelectionStackEntry>;
    protected uniqueMarkers_: import("..").IUniqueMarkers;
    protected attributeObservers_: IAttributeObserverInfo[];
    protected observers_: {
        intersections: Record<string, IIntersectionObserver>;
    };
    constructor(id_: string, root_: HTMLElement);
    SetReactiveState(state: ReactiveStateType): void;
    GetReactiveState(): ReactiveStateType;
    GetId(): string;
    GenerateUniqueId(prefix?: string, suffix?: string): string;
    SetName(name: string): void;
    GetName(): string;
    SetProxyAccessHandler(handler: IProxyAccessHandler | null): IProxyAccessHandler | null;
    GetProxyAccessHandler(): IProxyAccessHandler | null;
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
    FindElement(target: HTMLElement, predicate: (element: HTMLElement) => boolean): HTMLElement | null;
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
    GetGlobal(): import("..").IGlobal;
}
export {};
