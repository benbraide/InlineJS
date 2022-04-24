import { DirectiveManager } from "../directives/manager";
import { MagicManager } from "../magics/manager";
import { MutationObserver } from "../observers/mutation/base";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IGlobal } from "../types/global";
import { IProxy } from "../types/proxy";
import { IResourceConcept } from "../types/resource";
import { IRouterConcept } from "../types/router";
export declare class BaseGlobal implements IGlobal {
    private config_;
    private components_;
    private currentComponent_;
    private managers_;
    private uniqueMarkers_;
    private mutationObserver_;
    private routerConcept_;
    private resourceConcept_;
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
    GetMutationObserver(): MutationObserver;
    SetRouterConcept(concept: IRouterConcept): void;
    GetRouterConcept(): IRouterConcept | null;
    SetResourceConcept(concept: IResourceConcept): void;
    GetResourceConcept(): IResourceConcept | null;
    CreateChildProxy(owner: IProxy, name: string, target: any): IProxy;
}
