import { BaseComponent } from "../component/base";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { IComponent } from "../types/component";
import { ChangesMonitorType } from "../types/element-scope";
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

export class BaseGlobal implements IGlobal{
    private nothing_ = new Nothing;
    
    private config_: IConfig;
    private storedObjects_: Record<string, any> = {};
    
    private changesMonitorList_ = new Array<ChangesMonitorType>();
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
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'config',
            object: () => config,
        }), 'InlineJS.Global.ChangesMonitor::config'));
    }

    public GetConfig(){
        return this.config_;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        const generated = GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'markers',
            object: () => { return { ...this.uniqueMarkers_ } },
        }), 'InlineJS.Global.ChangesMonitor::markers'));
        return generated;
    }

    public StoreObject({ object, componentId, contextElement }: IObjectStoreParams){
        const key = `@!@${RandomString(18)}@!@`;

        if (contextElement){
            let scope = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))?.FindElementScope(contextElement);
            if (scope){
                scope.SetLocal(key, object);
                return key;
            }
        }

        this.storedObjects_[key] = object;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'stored-objects',
            object: () => { return { ...this.storedObjects_ } },
        }), 'InlineJS.Global.ChangesMonitor::stored-objects'));
        
        return key;
    }

    public RetrieveObject(params: IObjectRetrievalParams){
        return this.RetrieveObject_(params, true);
    }

    public PeekObject(params: IObjectRetrievalParams){
        return this.RetrieveObject_(params, false);
    }

    public AddChangesMonitor(monitor: ChangesMonitorType){
        this.changesMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.changesMonitorList_ } },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }

    public RemoveChangesMonitor(monitor: ChangesMonitorType){
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return { ...this.changesMonitorList_ } },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }

    public AddComponentMonitor(monitor: ComponentsMonitorType){
        this.componentsMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components-monitor',
            object: () => { return { ...this.componentsMonitorList_ } },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }

    public RemoveComponentMonitor(monitor: ComponentsMonitorType){
        let len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components-monitor',
            object: () => { return { ...this.componentsMonitorList_ } },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }
    
    public CreateComponent(root: HTMLElement){
        let existing = this.InferComponentFrom(root);
        if (existing){
            return existing;
        }

        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;

        this.componentsMonitorList_.forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components',
            object: () => { return { ...this.components_ } },
        }), 'InlineJS.Global.ChangesMonitor::components'));

        return component;
    }

    public RemoveComponent(component: IComponent | string){
        let key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)){
            let component = this.components_[key];
            delete this.components_[key];

            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'components',
                object: () => { return { ...this.components_ } },
            }), 'InlineJS.Global.ChangesMonitor::components'));
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
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'current-component',
            object: () => this.currentComponent_,
        }), 'InlineJS.Global.ChangesMonitor::current-component'));
    }

    public PopCurrentComponent(){
        let isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
        !isEmpty && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'current-component',
            object: () => this.currentComponent_,
        }), 'InlineJS.Global.ChangesMonitor::current-component'));
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
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-processors',
            object: () => { return [ ...this.attributeProcessors_ ] },
        }), 'InlineJS.Global.ChangesMonitor::attribute-processors'));
    }

    public DispatchAttributeProcessing(params: IAttributeProcessorParams){
        this.attributeProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }

    public AddTextContentProcessor(processor: TextContentProcessorType){
        this.textContentProcessors_.push(processor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'text-content-processors',
            object: () => { return [ ...this.textContentProcessors_ ] },
        }), 'InlineJS.Global.ChangesMonitor::text-content-processors'));
    }

    public DispatchTextContentProcessing(params: ITextContentProcessorParams){
        this.textContentProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }

    public GetMutationObserver(){
        return this.mutationObserver_;
    }

    public SetFetchConcept(concept: IFetchConcept | null){
        this.fetchConcept_ = concept;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'fetch-concept',
            object: () => this.fetchConcept_,
        }), 'InlineJS.Global.ChangesMonitor::fetch-concept'));
    }

    public GetFetchConcept(): IFetchConcept{
        return (this.fetchConcept_ || this.nativeFetch_);
    }

    public SetConcept<T>(name: string, concept: T){
        this.concepts_[name] = concept;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'concepts',
            object: () => { return { ...this.concepts_ } },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
    }

    public RemoveConcept(name: string){
        delete this.concepts_[name];
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'concepts',
            object: () => { return { ...this.concepts_ } },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
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

    private RetrieveObject_({ key, componentId, contextElement }: IObjectRetrievalParams, remove: boolean){
        if (contextElement){
            let component = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement));
            if (component){
                let found = component.FindElementLocal(contextElement, key, true);
                if (found){
                    let value = found.GetLocal(key);
                    remove && found.DeleteLocal(key);
                    return value;
                }
            }
        }

        if (this.storedObjects_.hasOwnProperty(key)){
            let value = this.storedObjects_[key];
            if (remove){
                delete this.storedObjects_[key];
                this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                    target: 'stored-objects',
                    object: () => { return { ...this.storedObjects_ } },
                }), 'InlineJS.Global.ChangesMonitor::stored-objects'));
            }
            return value;
        }

        return this.CreateNothing();
    }
}
