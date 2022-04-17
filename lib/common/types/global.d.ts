import { IComponent } from "./component";
import { IConfig } from "./config";
import { IDirectiveManager } from "./directives";
import { IMagicManager } from "./magics";
import { IMutationObserver } from "./mutation";
import { IProxy } from "./proxy";
export interface IGlobal {
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
    GetMutationObserver(): IMutationObserver;
    CreateChildProxy(owner: IProxy, name: string, target: any): IProxy;
}
