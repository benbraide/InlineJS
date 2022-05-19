import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { IComponent } from "./component";
import { IConfig } from "./config";
import { IDirectiveManager } from "./directive";
import { IFetchConcept } from "./fetch";
import { IMagicManager } from "./magic";
import { IMutationObserver } from "./mutation";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "./process";
import { IProxy } from "./proxy";

export interface IGlobal{
    SwapConfig(config: IConfig): void;
    GetConfig(): IConfig;

    GenerateUniqueId(prefix?: string, suffix?: string): string;
    
    CreateComponent(root: HTMLElement): IComponent;
    RemoveComponent(component: IComponent | string): void;
    TraverseComponents(callback: (component: IComponent) => void | boolean): void;

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

    SetConcept<T>(name: string, concept: T): void;
    RemoveConcept(name: string): void;
    GetConcept<T>(name: string): T | null;

    CreateChildProxy(owner: IProxy, name: string, target: any): IProxy;

    CreateFuture(callback: () => any): Future;
    IsFuture(value: any): boolean;

    CreateNothing(): Nothing;
    IsNothing(value: any): boolean;
}
