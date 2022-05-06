import { DirectiveManager } from "../directives/manager";
import { MagicManager } from "../magics/manager";
import { MutationObserver } from "../observers/mutation/base";
import { IAlertConcept } from "../types/alert";
import { ICollectionConcept } from "../types/collection";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IFetchConcept } from "../types/fetch";
import { IGlobal } from "../types/global";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "../types/process";
import { IProxy } from "../types/proxy";
import { IResourceConcept } from "../types/resource";
import { IRouterConcept } from "../types/router";
import { IScreenConcept } from "../types/screen";
import { ITimeDifferenceConcept } from "../types/time-diff";
export declare class BaseGlobal implements IGlobal {
    private config_;
    private components_;
    private currentComponent_;
    private attributeProcessors_;
    private textContentProcessors_;
    private managers_;
    private uniqueMarkers_;
    private mutationObserver_;
    private nativeFetch_;
    private fetchConcept_;
    private routerConcept_;
    private resourceConcept_;
    private alertConcept_;
    private collectionConcepts_;
    private screenConcept_;
    private timeDifferenceConcept_;
    private concepts_;
    constructor(configOptions?: IConfigOptions, idOffset?: number);
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
    GetDirectiveManager(): DirectiveManager;
    GetMagicManager(): MagicManager;
    AddAttributeProcessor(processor: AttributeProcessorType): void;
    DispatchAttributeProcessing(params: IAttributeProcessorParams): void;
    AddTextContentProcessor(processor: TextContentProcessorType): void;
    DispatchTextContentProcessing(params: ITextContentProcessorParams): void;
    GetMutationObserver(): MutationObserver;
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
}
