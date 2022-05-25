import { BaseComponent } from "../component/base";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IFetchConcept } from "../types/fetch";
import { ComponentsMonitorType, IGlobal } from "../types/global";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "../types/process";
import { IProxy } from "../types/proxy";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";

export class BaseGlobal implements IGlobal{
    private nothing_ = new Nothing;
    
    private config_: IConfig;
    
    private componentsMonitorList_ = new Array<ComponentsMonitorType>();
    private components_: Record<string, IComponent> = {};
    private currentComponent_ = new Stack<string>();

    private attributeProcessors_ = new Array<AttributeProcessorType>();
    private textContentProcessors_ = new Array<TextContentProcessorType>();

    private managers_ = {
        directive: new DirectiveManager(),
        magic: new MagicManager(),
    };
    
    private uniqueMarkers_ = GetDefaultUniqueMarkers();
    private mutationObserver_ = new MutationObserver();

    private nativeFetch_ = new NativeFetchConcept();
    private fetchConcept_: IFetchConcept | null = null;
    private concepts_: Record<string, any> = {};
    
    public constructor(configOptions?: IConfigOptions, idOffset = 0){
        this.config_ = new Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }

    public SwapConfig(config: IConfig){
        this.config_ = config;
    }

    public GetConfig(){
        return this.config_;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        return GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
    }

    public AddComponentMonitor(monitor: ComponentsMonitorType){
        this.componentsMonitorList_.push(monitor);
    }

    public RemoveComponentMonitor(monitor: ComponentsMonitorType){
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
    }
    
    public CreateComponent(root: HTMLElement){
        let existing = this.InferComponentFrom(root);
        if (existing){
            return existing;
        }

        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;

        this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));

        return component;
    }

    public RemoveComponent(component: IComponent | string){
        let key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)){
            let component = this.components_[key];
            delete this.components_[key];
            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
        }
    }

    public TraverseComponents(callback: (component: IComponent) => void | boolean){
        Object.values(this.components_).some(component => (callback(component) === false));
    }

    public FindComponentById(id: string): IComponent | null{
        return ((id && id in this.components_) ? this.components_[id] : null);
    }

    public FindComponentByName(name: string): IComponent | null{
        return ((name && Object.values(this.components_).find(component => (component.GetName() === name))) || null);
    }
    
    public FindComponentByRoot(root: HTMLElement): IComponent | null{
        return ((root && Object.values(this.components_).find(component => (component.GetRoot() === root))) || null);
    }

    public PushCurrentComponent(componentId: string){
        this.currentComponent_.Push(componentId);
    }

    public PopCurrentComponent(){
        return this.currentComponent_.Pop();
    }

    public PeekCurrentComponent(){
        return this.currentComponent_.Peek();
    }

    public GetCurrentComponent(): IComponent | null{
        return this.FindComponentById(this.PeekCurrentComponent() || '');
    }

    public InferComponentFrom(element: HTMLElement | null): IComponent | null{
        return ((element && Object.values(this.components_).find(component => (component.GetRoot() === element || component.GetRoot().contains(element)))) || null);
    }

    public GetDirectiveManager(){
        return this.managers_.directive;
    }

    public GetMagicManager(){
        return this.managers_.magic;
    }

    public AddAttributeProcessor(processor: AttributeProcessorType){
        this.attributeProcessors_.push(processor);
    }

    public DispatchAttributeProcessing(params: IAttributeProcessorParams){
        this.attributeProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }

    public AddTextContentProcessor(processor: TextContentProcessorType){
        this.textContentProcessors_.push(processor);
    }

    public DispatchTextContentProcessing(params: ITextContentProcessorParams){
        this.textContentProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }

    public GetMutationObserver(){
        return this.mutationObserver_;
    }

    public SetFetchConcept(concept: IFetchConcept | null){
        this.fetchConcept_ = concept;
    }

    public GetFetchConcept(): IFetchConcept{
        return (this.fetchConcept_ || this.nativeFetch_);
    }

    public SetConcept<T>(name: string, concept: T){
        this.concepts_[name] = concept;
    }

    public RemoveConcept(name: string){
        delete this.concepts_[name];
    }

    public GetConcept<T>(name: string){
        return (this.concepts_.hasOwnProperty(name) ? <T>this.concepts_[name] : null);
    }

    public CreateChildProxy(owner: IProxy, name: string, target: any): IProxy{
        return new ChildProxy(owner, name, target);
    }

    public CreateFuture(callback: () => any){
        return new Future(callback);
    }

    public IsFuture(value: any){
        return (value instanceof Future);
    }

    public CreateNothing(){
        return this.nothing_;
    }

    public IsNothing(value: any){
        return (value instanceof Nothing);
    }
}
