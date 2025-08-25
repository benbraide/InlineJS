import { BaseComponent } from "../component/base";
import { ChangesMonitor } from "../component/changes-monitor";
import { InvalidateComponentCache } from "../component/cache";
import { SetProxyAccessHandler } from "../component/set-proxy-access-handler";
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
import { IScope } from "../types/scope";
import { RandomString } from "../utilities/random-string";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";
import { IProxyAccessStorage } from "../types/storage";
import { ProxyAccessStorage } from "../storage/get-access";
import { RangeValueType, Range, TimedRange } from "../values/range";

export class BaseGlobal extends ChangesMonitor implements IGlobal{
    protected nothing_ = new Nothing;
    
    protected config_: IConfig;
    protected currentProxyAccessStorage_: IProxyAccessStorage | null = null;
    
    protected storedObjects_: Record<string, any> = {};
    protected lastStoredObjectKey_ = '';
    
    protected componentsMonitorList_ = new Array<ComponentsMonitorType>();

    protected components_: Record<string, IComponent> = {};
    protected currentComponent_ = new Stack<string>();

    protected scopeContext_ = new Stack<IScope>();

    protected attributeProcessors_ = new Array<AttributeProcessorType>();
    protected textContentProcessors_ = new Array<TextContentProcessorType>();

    protected customElements_: Record<string, CustomElementConstructor> = {};

    protected managers_ = {
        directive: new DirectiveManager(),
        magic: new MagicManager(),
    };
    
    protected uniqueMarkers_ = GetDefaultUniqueMarkers();
    protected mutationObserver_ = new MutationObserver();
    protected resizeObserver_ = new ResizeObserver();

    protected nativeFetch_ = new NativeFetchConcept();
    protected fetchConcept_: IFetchConcept | null = null;
    protected concepts_: Record<string, any> = {};
    
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

    public SetCurrentProxyAccessStorage(storage: IProxyAccessStorage | null): IProxyAccessStorage | null {
        const old = this.currentProxyAccessStorage_;
        this.currentProxyAccessStorage_ = storage;
        return old;
    }

    public GetCurrentProxyAccessStorage(): IProxyAccessStorage | null {
        return this.currentProxyAccessStorage_;
    }

    public UseProxyAccessStorage<T = any>(callback: (storage: IProxyAccessStorage) => T | undefined, storage?: IProxyAccessStorage | null): T | undefined {
        storage = storage || new ProxyAccessStorage();
        
        const old = this.SetCurrentProxyAccessStorage(storage);
        const result = JournalTry(() => callback(storage), 'InlineJS.Global.UseProxyAccessStorage');

        this.SetCurrentProxyAccessStorage(old);

        return result;
    }

    public SuspendProxyAccessStorage<T = any>(callback: () => T | undefined): T | undefined {
        const current = this.currentProxyAccessStorage_;
        current?.Suspend();

        const result = JournalTry(() => callback());
        current?.Resume();

        return result;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        const generated = GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }

    public StoreObject({ object, componentId, contextElement }: IObjectStoreParams){
        this.lastStoredObjectKey_ = `@!@${RandomString(18)}@!@`;

        if (contextElement){
            const scope = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))?.FindElementScope(contextElement);
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
        const len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.NotifyListeners_('components-monitors', this.componentsMonitorList_);
    }
    
    public CreateComponent(root: HTMLElement){
        const existing = this.InferComponentFrom(root);
        if (existing){
            return existing;
        }

        const component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;

        this.componentsMonitorList_.forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.NotifyListeners_('components', this.components_);

        return component;
    }

    public RemoveComponent(component: IComponent | string){
        const key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)){
            const component = this.components_[key];

            delete this.components_[key];
            component.Destroy();

            InvalidateComponentCache(key);

            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.NotifyListeners_('components', this.components_);
        }
    }

    public TraverseComponents(callback: (component: IComponent) => void | boolean){
        Object.values(this.components_).some(component => (callback(component) === false));
    }

    public FindComponentById(id: string): IComponent | null{
        return (id && this.components_.hasOwnProperty(id)) ? this.components_[id] : null;
    }

    public FindComponentByName(name: string): IComponent | null{
        return (name && Object.values(this.components_).find(component => (component.GetName() === name))) || null;
    }
    
    public FindComponentByRoot(root: HTMLElement|null): IComponent | null{
        return (root && Object.values(this.components_).find(component => (component.GetRoot() === root))) || null;
    }

    public FindComponentByCallback(callback: (component: IComponent) => boolean): IComponent | null {
        return Object.values(this.components_).find(callback) || null;
    }

    public PushCurrentComponent(componentId: string){
        this.currentComponent_.Push(componentId);
        this.NotifyListeners_('current-component', this.currentComponent_);
    }

    public PopCurrentComponent(){
        const isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
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

    public PushScopeContext(scope: IScope){
        this.scopeContext_.Push(scope);
        this.NotifyListeners_('scope-context', this.scopeContext_);
    }

    public PopScopeContext(){
        const isEmpty = this.scopeContext_.IsEmpty(), popped = this.scopeContext_.Pop();
        !isEmpty && this.NotifyListeners_('scope-context', this.scopeContext_);
        return popped;
    }

    public PeekScopeContext(){
        return this.scopeContext_.Peek();
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
        this.DispatchProcessing_(this.attributeProcessors_, params, 'InlineJS.Global.DispatchAttribute');
    }

    public AddTextContentProcessor(processor: TextContentProcessorType){
        this.textContentProcessors_.push(processor);
        this.NotifyListeners_('text-content-processors', this.textContentProcessors_);
    }

    public DispatchTextContentProcessing(params: ITextContentProcessorParams){
        this.DispatchProcessing_(this.textContentProcessors_, params, 'InlineJS.Global.DispatchTextContent');
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

    public CreateRange<T extends RangeValueType>(from: T, to: T): Range<T> {
        return new Range(from, to);
    }

    public IsRange(value: any){
        return value instanceof Range;
    }

    public CreateTimedRange<T extends RangeValueType>(from: T, to: T, duration: number, delay: number): TimedRange<T> {
        return new TimedRange(from, to, duration, delay);
    }

    public IsTimedRange(value: any): boolean {
        return value instanceof TimedRange;
    }

    protected RetrieveObject_({ key, componentId, contextElement }: IObjectRetrievalParams, remove: boolean){
        if (contextElement){
            const component = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement));
            if (component){
                const found = component.FindElementLocal(contextElement, key, true);
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

    protected DispatchProcessing_(
        processors: Array<AttributeProcessorType|TextContentProcessorType>,
        params: IAttributeProcessorParams|ITextContentProcessorParams,
        contextString: string
    ){
        const resolvedComponent = (params.component || this.FindComponentById(params.componentId)), pahCallback = SetProxyAccessHandler(resolvedComponent, (params.proxyAccessHandler || null));
        processors.forEach((processor) => {
            JournalTry(() => (processor as any)(params), contextString, params.contextElement);
        });
        pahCallback();
    }
}
