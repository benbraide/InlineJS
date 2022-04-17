import { BaseComponent } from "../component/base";
import { GetElementScopeId } from "../component/element-scope-id";
import { DirectiveManager } from "../directives/manager";
import { MagicManager } from "../magics/manager";
import { MutationObserver } from "../observers/mutation/base";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { IComponent } from "../types/component";
import { IConfig, IConfigOptions } from "../types/config";
import { IGlobal } from "../types/global";
import { IProxy } from "../types/proxy";
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

    public CreateChildProxy(owner: IProxy, name: string, target: any): IProxy{
        return new ChildProxy(owner, name, target);
    }
}
