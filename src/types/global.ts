import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { IAlertConcept } from "./alert";
import { ICollectionConcept } from "./collection";
import { IComponent } from "./component";
import { IConfig } from "./config";
import { IDirectiveManager } from "./directives";
import { IFetchConcept } from "./fetch";
import { IMagicManager } from "./magics";
import { IMutationObserver } from "./mutation";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "./process";
import { IProxy } from "./proxy";
import { IResourceConcept } from "./resource";
import { IRouterConcept } from "./router";
import { IScreenConcept } from "./screen";
import { ITimeDifferenceConcept } from "./time-diff";

export interface IGlobal{
    SwapConfig(config: IConfig): void;
    GetConfig(): IConfig;

    GenerateUniqueId(prefix?: string, suffix?: string): string;
    
    CreateComponent(root: HTMLElement): IComponent;
    RemoveComponent(component: IComponent | string): void;

    FindComponentById(id: string): IComponent | null;
    FindComponentByName(name: string): IComponent | null;
    FindComponentByRoot(root: HTMLElement): IComponent | null;

    PushCurrentComponent(componentId: string): void;
    PopCurrentComponent(): string | null;
    PeekCurrentComponent(): string | null;

    GetCurrentComponent(): IComponent | null;
    InferComponentFrom(element: HTMLElement | null): IComponent | null;

    GetDirectiveManager(): IDirectiveManager;
    GetMagicManager(): IMagicManager;

    AddAttributeProcessor(processor: AttributeProcessorType): void;
    DispatchAttributeProcessing(params: IAttributeProcessorParams): void;

    AddTextContentProcessor(processor: TextContentProcessorType): void;
    DispatchTextContentProcessing(params: ITextContentProcessorParams): void;

    GetMutationObserver(): IMutationObserver;

    SetFetchConcept(concept: IFetchConcept | null): void;
    GetFetchConcept(): IFetchConcept;

    SetRouterConcept(concept: IRouterConcept): void;
    GetRouterConcept(): IRouterConcept | null;

    SetResourceConcept(concept: IResourceConcept): void;
    GetResourceConcept(): IResourceConcept | null;

    SetAlertConcept(concept: IAlertConcept): void;
    GetAlertConcept(): IAlertConcept | null;

    SetCollectionConcept(concept: ICollectionConcept): void;
    GetCollectionConcept(name: string): ICollectionConcept | null;

    SetScreenConcept(concept: IScreenConcept): void;
    GetScreenConcept(): IScreenConcept | null;

    SetTimeDifferenceConcept(concept: ITimeDifferenceConcept): void;
    GetTimeDifferenceConcept(): ITimeDifferenceConcept | null;

    SetConcept<T>(name: string, concept: T): void;
    GetConcept<T>(name: string): T | null;

    CreateChildProxy(owner: IProxy, name: string, target: any): IProxy;

    CreateFuture(callback: () => any): Future;
    IsFuture(value: any): boolean;

    CreateNothing(): Nothing;
    IsNothing(value: any): boolean;
}
