import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Range, RangeValueType } from "../values/range";
import { IComponent } from "./component";
import { IConfig } from "./config";
import { IDirectiveManager } from "./directive";
import { IFetchConcept } from "./fetch";
import { IMagicManager } from "./magic";
import { IMutationObserver } from "./mutation";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "./process";
import { IProxy } from "./proxy";
import { IResizeObserver } from "./resize-observer";
import { IScope } from "./scope";
import { IProxyAccessStorage } from "./storage";
export interface IComponentsMonitorParams {
    action: 'add' | 'remove';
    component: IComponent;
}
export interface IObjectStoreParams {
    object: any;
    componentId?: string;
    contextElement?: HTMLElement;
}
export interface IObjectRetrievalParams {
    key: string;
    componentId?: string;
    contextElement?: HTMLElement;
}
export type ComponentsMonitorType = (params: IComponentsMonitorParams) => void;
export interface IGlobal {
    SwapConfig(config: IConfig): void;
    GetConfig(): IConfig;
    SetCurrentProxyAccessStorage(storage: IProxyAccessStorage | null): IProxyAccessStorage | null;
    GetCurrentProxyAccessStorage(): IProxyAccessStorage | null;
    UseProxyAccessStorage<T = any>(callback: (storage: IProxyAccessStorage) => T | undefined, storage?: IProxyAccessStorage | null): T | undefined;
    SuspendProxyAccessStorage<T = any>(callback: () => T | undefined): T | undefined;
    GenerateUniqueId(prefix?: string, suffix?: string): string;
    StoreObject(params: IObjectStoreParams): string;
    RetrieveObject(params: IObjectRetrievalParams): any;
    PeekObject(params: IObjectRetrievalParams): any;
    GetLastObjectKey(): string;
    AddComponentMonitor(monitor: ComponentsMonitorType): void;
    RemoveComponentMonitor(monitor: ComponentsMonitorType): void;
    CreateComponent(root: HTMLElement): IComponent;
    RemoveComponent(component: IComponent | string): void;
    TraverseComponents(callback: (component: IComponent) => void | boolean): void;
    FindComponentById(id: string): IComponent | null;
    FindComponentByName(name: string): IComponent | null;
    FindComponentByRoot(root: HTMLElement | null): IComponent | null;
    FindComponentByCallback(callback: (component: IComponent) => boolean): IComponent | null;
    PushCurrentComponent(componentId: string): void;
    PopCurrentComponent(): string | null;
    PeekCurrentComponent(): string | null;
    GetCurrentComponent(): IComponent | null;
    InferComponentFrom(element: HTMLElement | null): IComponent | null;
    PushScopeContext(scope: IScope): void;
    PopScopeContext(): IScope | null;
    PeekScopeContext(): IScope | null;
    GetDirectiveManager(): IDirectiveManager;
    GetMagicManager(): IMagicManager;
    AddAttributeProcessor(processor: AttributeProcessorType): void;
    DispatchAttributeProcessing(params: IAttributeProcessorParams): void;
    AddTextContentProcessor(processor: TextContentProcessorType): void;
    DispatchTextContentProcessing(params: ITextContentProcessorParams): void;
    GetMutationObserver(): IMutationObserver;
    GetResizeObserver(): IResizeObserver;
    SetFetchConcept(concept: IFetchConcept | null): void;
    GetFetchConcept(): IFetchConcept;
    SetConcept<T>(name: string, concept: T): void;
    RemoveConcept(name: string): void;
    GetConcept<T>(name: string): T | null;
    AddCustomElement(name: string, constructor: CustomElementConstructor): void;
    FindCustomElement(name: string): CustomElementConstructor | null;
    CreateChildProxy(owner: IProxy, name: string, target: any): IProxy;
    CreateFuture(callback: () => any): Future;
    IsFuture(value: any): boolean;
    CreateNothing(): Nothing;
    IsNothing(value: any): boolean;
    CreateRange<T extends RangeValueType>(from: T, to: T): Range<T>;
    IsRange(value: any): boolean;
}
