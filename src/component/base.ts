import { ProcessDirectives } from "../directive/process";
import { GetGlobal } from "../global/get";
import { IntersectionObserver } from "../observers/intersection/base";
import { RootProxy } from "../proxy/root";
import { Stack } from "../stack";
import { IChanges } from "../types/changes";
import { IComponent, IComponentBackend } from "../types/component";
import { ReactiveStateType } from "../types/config";
import { IElementScope } from "../types/element-scope";
import { IIntersectionObserver } from "../types/intersection";
import { IProxy } from "../types/proxy";
import { IRootElement } from "../types/root-element";
import { IScope } from "../types/scope";
import { ISelectionStackEntry } from "../types/selection";
import { ContextKeys } from "../utilities/context-keys";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Nothing } from "../values/nothing";
import { Changes } from "./changes";
import { Context } from "./context";
import { ElementScope } from "./element-scope";
import { ElementScopeKey, GetElementScopeId } from "./element-scope-id";
import { FindComponentById } from "./find";
import { GetConfig } from "./get-config";
import { Scope } from "./scope";

export class BaseComponent implements IComponent{
    private reactiveState_: ReactiveStateType = 'default';
    private name_ = '';
    
    private context_ = new Context;
    private changes_: IChanges;

    private scopes_: Record<string, IScope> = {};
    private elementScopes_: Record<string, IElementScope> = {};

    private rootProxy_: RootProxy;
    private proxies_: Record<string, IProxy> = {};
    private refs_: Record<string, HTMLElement> = {};
    
    private currentScope_ = new Stack<string>();
    private selectionScopes_ = new Stack<ISelectionStackEntry>();
    private uniqueMarkers_ = GetDefaultUniqueMarkers();

    private observers_ = {
        intersections: <Record<string, IIntersectionObserver>>{},
    };

    public constructor(private id_: string, private root_: HTMLElement){
        this.changes_ = new Changes(this.id_);

        this.rootProxy_ = new RootProxy(this.id_, {});
        this.proxies_[this.rootProxy_.GetPath()] = this.rootProxy_;

        this.CreateElementScope(this.root_);
        GetGlobal().GetMutationObserver().Observe(this.root_, ({ added, removed, attributes }) => {
            let component = FindComponentById(id_);
            if (!component){
                return;
            }

            let checklist = new Array<HTMLElement>(), dirRegex = GetGlobal().GetConfig().GetDirectiveRegex();
            attributes?.filter(attr => (attr.target instanceof HTMLElement)).forEach((attr) => {
                if (!dirRegex.test(attr.name)){
                    component?.FindElementScope(<HTMLElement>attr.target)?.ExecuteAttributeChangeCallbacks(attr.name);
                }
                else if ((attr.target as HTMLElement).hasAttribute(attr.name) && !checklist.includes(<HTMLElement>attr.target)){
                    checklist.push(<HTMLElement>attr.target);
                }
            });

            checklist.forEach(element => ProcessDirectives({ element,
                component: component!, 
                options: {
                    checkTemplate: true,
                    checkDocument: false,
                    ignoreChildren: false,
                },
            }));

            let addedBackup = [...(added || [])];
            added?.filter(node => !removed?.includes(node)).forEach((node) => {
                if (node instanceof HTMLElement){
                    ProcessDirectives({
                        component: component!,
                        element: <HTMLElement>node,
                        options: {
                            checkTemplate: true,
                            checkDocument: false,
                            ignoreChildren: false,
                        },
                    });
                }
            });

            removed?.filter(node => !addedBackup.includes(node)).forEach((node) => {
                if (node instanceof HTMLElement){
                    component!.FindElementScope(node)?.Destroy();
                }
            });
        }, ['add', 'remove', 'attribute']);
    }
    
    public SetReactiveState(state: ReactiveStateType){
        this.reactiveState_ = state;
    }

    public GetReactiveState(){
        return ((this.reactiveState_ === 'default') ? GetConfig().GetReactiveState() : this.reactiveState_);
    }

    public GetId(){
        return this.id_;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        return GenerateUniqueId(this.uniqueMarkers_, `Cmpnt<${this.id_}>.`, prefix, suffix);
    }

    public SetName(name: string){
        this.name_ = name;
    }

    public GetName(){
        return this.name_;
    }

    public CreateScope(root: HTMLElement){
        let existing = Object.values(this.scopes_).find(scope => (scope.GetRoot() === root));
        if (existing){
            return existing;
        }

        if (root === this.root_ || !this.root_.contains(root)){
            return null;
        }

        let scope = new Scope(this.id_, this.GenerateUniqueId('scope_'), root);
        this.scopes_[scope.GetId()] = scope;

        return scope;
    }

    public RemoveScope(scope: IScope | string){
        let id = ((typeof scope === 'string') ? scope : scope.GetId());
        if (id in this.scopes_){
            delete this.scopes_[id];
        }
    }

    public FindScopeById(id: string): IScope | null{
        return ((id in this.scopes_) ? this.scopes_[id] : null);
    }

    public FindScopeByName(name: string): IScope | null{
        return (Object.values(this.scopes_).find(scope => (scope.GetName() === name)) || null);
    }

    public FindScopeByRoot(root: HTMLElement): IScope | null{
        return (Object.values(this.scopes_).find(scope => (scope.GetRoot() === root)) || null);
    }

    public PushCurrentScope(scopeId: string){
        this.currentScope_.Push(scopeId);
    }

    public PopCurrentScope(): string | null{
        return this.currentScope_.Pop();
    }

    public PeekCurrentScope(): string | null{
        return this.currentScope_.Peek();
    }

    public InferScopeFrom(element: HTMLElement | null): IScope | null{
        return (this.FindScopeById(this.FindElementScope(GetElementScopeId(element))?.GetScopeId() || '') || null);
    }

    public PushSelectionScope(): ISelectionStackEntry{
        let scope: ISelectionStackEntry = {
            set: false,
        };
        this.selectionScopes_.Push(scope);
        return scope;
    }

    public PopSelectionScope(): ISelectionStackEntry | null{
        return this.selectionScopes_.Pop();
    }

    public PeekSelectionScope(): ISelectionStackEntry | null{
        return this.selectionScopes_.Peek();
    }

    public GetRoot(): HTMLElement{
        return this.root_;
    }

    public FindElement(deepestElement: HTMLElement, predicate: (element?: HTMLElement) => boolean): HTMLElement | null{
        if (deepestElement === this.root_ || !this.root_.contains(deepestElement)){
            return null;
        }

        do{
            deepestElement = <HTMLElement>deepestElement.parentElement;
            try{
                if (predicate(deepestElement)){
                    return deepestElement;
                }
            }
            catch {}
        } while (deepestElement !== this.root_)

        return null;
    }

    public FindAncestor(target: HTMLElement, index?: number): HTMLElement | null{
        let realIndex = (index || 0);
        return this.FindElement(target, () => (realIndex-- == 0));
    }

    public CreateElementScope(element: HTMLElement): IElementScope | null{
        let existing = Object.values(this.elementScopes_).find(scope => (scope.GetElement() === element));
        if (existing){
            return existing;
        }

        if (element !== this.root_ && !this.root_.contains(element)){
            return null;
        }

        let elementScope = new ElementScope(this.id_, this.GenerateUniqueId('elscope_'), element, (element === this.root_));
        this.elementScopes_[elementScope.GetId()] = elementScope;
        element[ElementScopeKey] = elementScope.GetId();

        return elementScope;
    }

    public RemoveElementScope(id: string){
        delete this.elementScopes_[id];
    }

    public FindElementScope(element: HTMLElement | string | true | IRootElement): IElementScope | null{
        if (typeof element === 'string'){
            return ((element in this.elementScopes_) ? this.elementScopes_[element] : null);
        }

        let target = ((element === true) ? <HTMLElement>this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_));
        if (target && ElementScopeKey in target && target[ElementScopeKey] in this.elementScopes_){
            return this.elementScopes_[target[ElementScopeKey]];
        }

        return null;
    }

    public FindElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean){
        let elementScope = this.FindElementScope(element), value = (elementScope ? elementScope.GetLocal(key) : new Nothing);
        if (!(value instanceof Nothing) || !shouldBubble || (!elementScope && typeof element === 'string')){
            return value;
        }

        let target = (elementScope?.GetElement() || ((element === true) ? <HTMLElement>this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target){
            return value;
        }

        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocalValue(ancestor, key, true) : value);
    }

    public AddProxy(proxy: IProxy){
        this.proxies_[proxy.GetPath()] = proxy;
    }

    public RemoveProxy(proxy: IProxy | string){
        let path = ((typeof proxy === 'string') ? proxy : proxy.GetPath());
        if (path in this.proxies_){
            delete this.proxies_[path];
        }
    }

    public GetRootProxy(): IProxy{
        return this.rootProxy_;
    }
    
    public FindProxy(path: string): IProxy | null{
        return ((path in this.proxies_) ? this.proxies_[path] : null);
    }

    public AddRefElement(ref: string, element: HTMLElement){
        this.refs_[ref] = element;
    }

    public FindRefElement(ref: string): HTMLElement | null{
        return ((ref in this.refs_) ? this.refs_[ref] : null);
    }

    public CreateIntersectionObserver(options?: IntersectionObserverInit){
        let observer = new IntersectionObserver(this.GenerateUniqueId('intobs_'), (options || {}));
        return (this.observers_.intersections[observer.GetId()] = observer);
    }

    public FindIntersectionObserver(id: string){
        return ((id in this.observers_.intersections) ? this.observers_.intersections[id] : null);
    }

    public RemoveIntersectionObserver(id: string){
        if (id in this.observers_.intersections){
            delete this.observers_.intersections[id];
        }
    }

    public GetBackend(): IComponentBackend{
        return {
            context: this.context_,
            changes: this.changes_,
        };
    }
}
