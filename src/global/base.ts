import { BaseComponent } from "../component/base";
import { ChangesMonitor } from "../component/changes-monitor";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ResizeObserver } from "../observers/resize";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IFetchConcept } from "../types/fetch";
import { ComponentsMonitorType, IObjectRetrievalParams, IObjectStoreParams, IGlobal } from "../types/global";
import { AttributeProcessorType, IAttributeProcessorParams, ITextContentProcessorParams, TextContentProcessorType } from "../types/process";
import { IProxy } from "../types/proxy";
import { RandomString } from "../utilities/random-string";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";

export class BaseGlobal extends ChangesMonitor implements IGlobal{
    private nothing_ = new Nothing;
    
    private config_: IConfig;
    private storedObjects_: Record<string, any> = {};
    private lastStoredObjectKey_ = '';
    
    private componentsMonitorList_ = new Array<ComponentsMonitorType>();

    private components_: Record<string, IComponent> = {};
    private currentComponent_ = new Stack<string>();

    private attributeProcessors_ = new Array<AttributeProcessorType>();
    private textContentProcessors_ = new Array<TextContentProcessorType>();

    private customElements_: Record<string, CustomElementConstructor> = {};

    private managers_ = {
        directive: new DirectiveManager(),
        magic: new MagicManager(),
    };
    
    private uniqueMarkers_ = GetDefaultUniqueMarkers();
    private mutationObserver_ = new MutationObserver();
    private resizeObserver_ = new ResizeObserver();

    private nativeFetch_ = new NativeFetchConcept();
    private fetchConcept_: IFetchConcept | null = null;
    private concepts_: Record<string, any> = {};
    
    public constructor(configOptions?: IConfigOptions, idOffset = 0){
        super();
        this.config_ = new Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }

    public SwapConfig(config: IConfig){
        this.NotifyListeners_('config', (this.config_ = config));
    }

    public GetConfig(){
        return this.config_;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        const generated = GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }

    public StoreObject({ object, componentId, contextElement }: IObjectStoreParams){
        this.lastStoredObjectKey_ = `@!@${RandomString(18)}@!@`;

        if (contextElement){
            let scope = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))?.FindElementScope(contextElement);
            if (scope){
                scope.SetLocal(this.lastStoredObjectKey_, object);
                return this.lastStoredObjectKey_;
            }
        }

        this.storedObjects_[this.lastStoredObjectKey_] = object;
        this.NotifyListeners_('stored-objects', this.storedObjects_);
        
        return this.lastStoredObjectKey_;
    }

    public RetrieveObject(params: IObjectRetrievalParams){
        return this.RetrieveObject_(params, true);
    }

    public PeekObject(params: IObjectRetrievalParams){
        return this.RetrieveObject_(params, false);
    }

    public GetLastObjectKey(){
        return this.lastStoredObjectKey_;
    }

    public AddComponentMonitor(monitor: ComponentsMonitorType){
        this.componentsMonitorList_.push(monitor);
        this.NotifyListeners_('components-monitors', this.componentsMonitorList_);
    }

    public RemoveComponentMonitor(monitor: ComponentsMonitorType){
        let len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.NotifyListeners_('components-monitors', this.componentsMonitorList_);
    }
    
    public CreateComponent(root: HTMLElement){
        let existing = this.InferComponentFrom(root);
        if (existing){
            return existing;
        }

        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;

        this.componentsMonitorList_.forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.NotifyListeners_('components', this.components_);

        return component;
    }

    public RemoveComponent(component: IComponent | string){
        let key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)){
            let component = this.components_[key];
            delete this.components_[key];

            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.NotifyListeners_('components', this.components_);
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
        this.NotifyListeners_('current-component', this.currentComponent_);
    }

    public PopCurrentComponent(){
        let isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
        !isEmpty && this.NotifyListeners_('current-component', this.currentComponent_);
        return popped;
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
        this.NotifyListeners_('attribute-processors', this.attributeProcessors_);
    }

    public DispatchAttributeProcessing(params: IAttributeProcessorParams){
        this.attributeProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }

    public AddTextContentProcessor(processor: TextContentProcessorType){
        this.textContentProcessors_.push(processor);
        this.NotifyListeners_('text-content-processors', this.textContentProcessors_);
    }

    public DispatchTextContentProcessing(params: ITextContentProcessorParams){
        this.textContentProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }

    public GetMutationObserver(){
        return this.mutationObserver_;
    }

    public GetResizeObserver(){
        return this.resizeObserver_;
    }

    public SetFetchConcept(concept: IFetchConcept | null){
        this.fetchConcept_ = concept;
        this.NotifyListeners_('fetch-concept', this.fetchConcept_);
    }

    public GetFetchConcept(): IFetchConcept{
        return (this.fetchConcept_ || this.nativeFetch_);
    }

    public SetConcept<T>(name: string, concept: T){
        this.concepts_[name] = concept;
        this.NotifyListeners_('concepts', this.concepts_);
    }

    public RemoveConcept(name: string){
        delete this.concepts_[name];
        this.NotifyListeners_('concepts', this.concepts_);
    }

    public GetConcept<T>(name: string){
        return (this.concepts_.hasOwnProperty(name) ? <T>this.concepts_[name] : null);
    }

    public AddCustomElement(name: string, constructor: CustomElementConstructor){
        if (this.customElements_.hasOwnProperty(name)){//Already exists
            return;
        }

        this.customElements_[name] = constructor;
        customElements.define(this.config_.GetElementName(name), constructor);
        this.NotifyListeners_('custom-elements', this.customElements_);
    }

    public FindCustomElement(name: string){
        return (this.customElements_.hasOwnProperty(name) ? this.customElements_[name] : null);
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

    private RetrieveObject_({ key, componentId, contextElement }: IObjectRetrievalParams, remove: boolean){
        if (contextElement){
            let component = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement));
            if (component){
                let found = component.FindElementLocal(contextElement, key, true);
                if (found){
                    const value = found.GetLocal(key);
                    if (remove){
                        found.DeleteLocal(key);
                        (key === this.lastStoredObjectKey_) && (this.lastStoredObjectKey_ = '');
                    }
                    return value;
                }
            }
        }

        if (this.storedObjects_.hasOwnProperty(key)){
            const value = this.storedObjects_[key];
            if (remove){
                (key === this.lastStoredObjectKey_) && (this.lastStoredObjectKey_ = '');
                delete this.storedObjects_[key];
                this.NotifyListeners_('stored-objects', this.storedObjects_);
            }
            return value;
        }

        return this.CreateNothing();
    }
}
