import { BaseComponent } from "../component/base";
import { GetElementScopeId } from "../component/element-scope-id";
import { NativeFetchConcept } from "../concepts/fetch/native";
import { DirectiveManager } from "../directives/manager";
import { MagicManager } from "../magics/manager";
import { MutationObserver } from "../observers/mutation/base";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { IAlertConcept } from "../types/alert";
import { ICollectionConcept } from "../types/collection";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IFetchConcept } from "../types/fetch";
import { IGlobal } from "../types/global";
import { IProxy } from "../types/proxy";
import { IResourceConcept } from "../types/resource";
import { IRouterConcept } from "../types/router";
import { IScreenConcept } from "../types/screen";
import { ITimeDifferenceConcept } from "../types/time-diff";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Config } from "./config";

export class BaseGlobal implements IGlobal{
    private config_: IConfig;
    
    private components_: Record<string, IComponent> = {};
    private currentComponent_ = new Stack<string>();

    private managers_ = {
        directive: new DirectiveManager(),
        magic: new MagicManager(),
    };
    
    private uniqueMarkers_ = GetDefaultUniqueMarkers();
    private mutationObserver_ = new MutationObserver();

    private nativeFetch_ = new NativeFetchConcept();
    private fetchConcept_: IFetchConcept | null = null;

    private routerConcept_: IRouterConcept | null = null;
    private resourceConcept_: IResourceConcept | null = null;
    private alertConcept_: IAlertConcept | null = null;
    private collectionConcepts_: Record<string, ICollectionConcept> = {};
    private screenConcept_: IScreenConcept | null = null;
    private timeDifferenceConcept_: ITimeDifferenceConcept | null = null;
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
    
    public CreateComponent(root: HTMLElement){
        let existing = Object.values(this.components_).find(component => (component.GetRoot() === root));
        if (existing){
            return existing;
        }

        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;

        return component;
    }

    public RemoveComponent(component: IComponent | string){
        delete this.components_[((typeof component === 'string') ? component : component.GetId())];
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
        let scopeId = GetElementScopeId(element);
        return ((scopeId && Object.values(this.components_).find(component => !!component.FindElementScope(scopeId))) || null);
    }

    public GetDirectiveManager(){
        return this.managers_.directive;
    }

    public GetMagicManager(){
        return this.managers_.magic;
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

    public SetRouterConcept(concept: IRouterConcept){
        this.routerConcept_ = concept;
    }

    public GetRouterConcept(){
        return this.routerConcept_;
    }

    public SetResourceConcept(concept: IResourceConcept){
        this.resourceConcept_ = concept;
    }

    public GetResourceConcept(){
        return this.resourceConcept_;
    }

    public SetAlertConcept(concept: IAlertConcept){
        this.alertConcept_ = concept;
    }

    public GetAlertConcept(){
        return this.alertConcept_;
    }

    public SetCollectionConcept(concept: ICollectionConcept){
        this.collectionConcepts_[concept.GetName()] = concept;
    }

    public GetCollectionConcept(name: string){
        return (this.collectionConcepts_.hasOwnProperty(name) ? this.collectionConcepts_[name] : null);
    }

    public SetScreenConcept(concept: IScreenConcept){
        this.screenConcept_ = concept;
    }

    public GetScreenConcept(){
        return this.screenConcept_;
    }

    public SetTimeDifferenceConcept(concept: ITimeDifferenceConcept){
        this.timeDifferenceConcept_ = concept;
    }

    public GetTimeDifferenceConcept(){
        return this.timeDifferenceConcept_;
    }

    public SetConcept<T>(name: string, concept: T){
        this.concepts_[name] = concept;
    }

    public GetConcept<T>(name: string){
        return (this.concepts_.hasOwnProperty(name) ? <T>this.concepts_[name] : null);
    }

    public CreateChildProxy(owner: IProxy, name: string, target: any): IProxy{
        return new ChildProxy(owner, name, target);
    }
}
