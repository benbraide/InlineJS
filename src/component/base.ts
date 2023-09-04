import { CreateDirective } from "../directive/create";
import { DispatchDirective } from "../directive/dispatch";
import { ProcessDirectives } from "../directive/process";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { RootProxy } from "../proxy/root";
import { Stack } from "../stack";
import { IChanges } from "../types/changes";
import { IComponent, IComponentBackend, IElementScopeCreatedCallbackParams } from "../types/component";
import { ReactiveStateType } from "../types/config";
import { IElementScope } from "../types/element-scope";
import { IIntersectionObserver } from "../types/intersection";
import { IMutationObserverAttributeInfo } from "../types/mutation";
import { IProxy } from "../types/proxy";
import { IRootElement } from "../types/root-element";
import { IScope } from "../types/scope";
import { ISelectionStackEntry } from "../types/selection";
import { ContextKeys } from "../utilities/context-keys";
import { FindFirstAttribute } from "../utilities/get-attribute";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Changes } from "./changes";
import { ChangesMonitor } from "./changes-monitor";
import { Context } from "./context";
import { ElementScope } from "./element-scope";
import { ElementScopeKey, GetElementScopeId } from "./element-scope-id";
import { FindComponentById } from "./find";
import { GetConfig } from "./get-config";
import { Scope } from "./scope";

interface IAttributeObserverInfo{
    element: HTMLElement;
    callback: (list: Array<IMutationObserverAttributeInfo>) => void;
}

export class BaseComponent extends ChangesMonitor implements IComponent{
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

    private attributeObservers_ = new Array<IAttributeObserverInfo>();

    private observers_ = {
        intersections: <Record<string, IIntersectionObserver>>{},
    };

    public constructor(private id_: string, private root_: HTMLElement){
        super();
        
        this.changes_ = new Changes(this.id_);

        this.rootProxy_ = new RootProxy(this.id_, {});
        this.proxies_[this.rootProxy_.GetPath()] = this.rootProxy_;

        GetGlobal().GetMutationObserver().Observe(this.root_, ({ added, removed, attributes }) => {
            let component = FindComponentById(id_);
            if (!component){
                return;
            }

            let checklist = new Array<HTMLElement>(), dirRegex = GetGlobal().GetConfig().GetDirectiveRegex();
            let filteredAttributes = attributes?.filter(attr => (attr.target instanceof HTMLElement));
            
            filteredAttributes?.forEach((attr) => {
                if (!dirRegex.test(attr.name)){
                    component?.FindElementScope(<HTMLElement>attr.target)?.ExecuteAttributeChangeCallbacks(attr.name);
                }
                else if ((attr.target as HTMLElement).hasAttribute(attr.name) && !checklist.includes(<HTMLElement>attr.target)){
                    checklist.push(<HTMLElement>attr.target);
                }
            });

            if (filteredAttributes){//Alert listeners
                this.attributeObservers_.forEach((info) => {
                    let list = filteredAttributes!.filter(attr => (attr.target === info.element || info.element.contains(attr.target)));
                    (list.length != 0) && JournalTry(() => info.callback(list));
                });
            }

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

                    for (let parent = node.parentElement; parent; parent = parent.parentElement){
                        component?.FindElementScope(parent)?.ExecuteTreeChangeCallbacks([node], []);
                        if (parent === this.root_){
                            break;
                        }
                    }
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
        this.NotifyListeners_('reactive-state', (this.reactiveState_ = state));
    }

    public GetReactiveState(){
        return ((this.reactiveState_ === 'default') ? GetConfig().GetReactiveState() : this.reactiveState_);
    }

    public GetId(){
        return this.id_;
    }

    public GenerateUniqueId(prefix?: string, suffix?: string){
        const generated = GenerateUniqueId(this.uniqueMarkers_, `Cmpnt<${this.id_}>.`, prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }

    public SetName(name: string){
        this.NotifyListeners_('name', (this.name_ = name));
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

        this.AddProxy(scope.GetProxy());
        this.NotifyListeners_('scopes', this.scopes_);

        return scope;
    }

    public RemoveScope(scope: IScope | string){
        let id = ((typeof scope === 'string') ? scope : scope.GetId());
        if (this.scopes_.hasOwnProperty(id)){
            this.RemoveProxy(this.scopes_[id].GetProxy());
            delete this.scopes_[id];
            this.NotifyListeners_('scopes', this.scopes_);
        }
    }

    public FindScopeById(id: string): IScope | null{
        return (this.scopes_.hasOwnProperty(id) ? this.scopes_[id] : null);
    }

    public FindScopeByName(name: string): IScope | null{
        return (Object.values(this.scopes_).find(scope => (scope.GetName() === name)) || null);
    }

    public FindScopeByRoot(root: HTMLElement): IScope | null{
        return (Object.values(this.scopes_).find(scope => (scope.GetRoot() === root)) || null);
    }

    public PushCurrentScope(scopeId: string){
        this.currentScope_.Push(scopeId);
        this.NotifyListeners_('current-scope', this.currentScope_);
    }

    public PopCurrentScope(): string | null{
        let isEmpty = this.currentScope_.IsEmpty(), popped = this.currentScope_.Pop();
        !isEmpty && this.NotifyListeners_('current-scope', this.currentScope_);
        return popped
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
        this.NotifyListeners_('selection-scopes', this.selectionScopes_);
        
        return scope;
    }

    public PopSelectionScope(): ISelectionStackEntry | null{
        let isEmpty = this.selectionScopes_.IsEmpty(), popped = this.selectionScopes_.Pop();
        !isEmpty && this.NotifyListeners_('selection-scopes', this.selectionScopes_);
        return popped;
    }

    public PeekSelectionScope(): ISelectionStackEntry | null{
        return this.selectionScopes_.Peek();
    }

    public GetRoot(): HTMLElement{
        return this.root_;
    }

    public FindElement(target: HTMLElement, predicate: (element: HTMLElement) => boolean): HTMLElement | null{
        if (target === this.root_ || !this.root_.contains(target)){
            return null;
        }

        for (let ancestor = target.parentNode; ancestor; ancestor = ancestor.parentNode){
            try{
                if ((ancestor instanceof HTMLElement) && predicate(ancestor)){
                    return ancestor;
                }

                if (ancestor === this.root_){
                    break;
                }
            }
            catch{
                break;
            }
        }

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

        let processDirective = (name: string) => {
            let info = FindFirstAttribute(element, [GetConfig().GetDirectiveName(name, false), GetConfig().GetDirectiveName(name, true)]);
            if (info){
                let directive = CreateDirective(info.name, info.value);
                directive && DispatchDirective(this, element, directive);
            }
        }

        ['data', 'component', 'ref', 'locals', 'init'].forEach(dir => processDirective(dir));
        elementScope.SetInitialized();

        if ('OnElementScopeCreated' in element && typeof (element as any).OnElementScopeCreated === 'function'){
            JournalTry(() => ((element as any).OnElementScopeCreated as (params: IElementScopeCreatedCallbackParams) => void)({
                componentId: this.id_,
                component: this,
                scope: elementScope,
            }));
        }

        this.NotifyListeners_('element-scopes', this.elementScopes_);

        return elementScope;
    }

    public RemoveElementScope(id: string){
        delete this.elementScopes_[id];
        this.NotifyListeners_('element-scopes', this.elementScopes_);
    }

    public FindElementScope(element: HTMLElement | string | true | IRootElement): IElementScope | null{
        if (typeof element === 'string'){
            return ((element in this.elementScopes_) ? this.elementScopes_[element] : null);
        }

        let target = ((element === true) ? <HTMLElement>this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_));
        if (target && ElementScopeKey in target && typeof target[ElementScopeKey] === 'string' && target[ElementScopeKey] in this.elementScopes_){
            return this.elementScopes_[target[ElementScopeKey]];
        }

        return null;
    }

    public FindElementLocal(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean): IElementScope | null{
        let elementScope = this.FindElementScope(element);
        if (elementScope?.HasLocal(key)){
            return elementScope;
        }

        if (!shouldBubble || (!elementScope && typeof element === 'string')){
            return null;
        }

        let target = (elementScope?.GetElement() || ((element === true) ? <HTMLElement>this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target){
            return null;
        }

        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocal(ancestor, key, true) : null);
    }

    public FindElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, shouldBubble?: boolean){
        let elementScope = this.FindElementScope(element), value = (elementScope ? elementScope.GetLocal(key) : GetGlobal().CreateNothing());
        if (!GetGlobal().IsNothing(value) || !shouldBubble || (!elementScope && typeof element === 'string')){
            return value;
        }

        let target = (elementScope?.GetElement() || ((element === true) ? <HTMLElement>this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target){
            return value;
        }

        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocalValue(ancestor, key, true) : value);
    }

    public SetElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string, value: any){
        this.FindElementScope(element)?.SetLocal(key, value);
    }

    public DeleteElementLocalValue(element: HTMLElement | string | true | IRootElement, key: string){
        this.FindElementScope(element)?.DeleteLocal(key);
    }

    public AddProxy(proxy: IProxy){
        this.proxies_[proxy.GetPath()] = proxy;
        this.NotifyListeners_('proxies', this.proxies_);
    }

    public RemoveProxy(proxy: IProxy | string){
        let path = ((typeof proxy === 'string') ? proxy : proxy.GetPath());
        if (this.proxies_.hasOwnProperty(path)){
            delete this.proxies_[path];
            this.NotifyListeners_('proxies', this.proxies_);
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
        this.NotifyListeners_('refs', this.refs_);
    }

    public FindRefElement(ref: string): HTMLElement | null{
        return ((ref in this.refs_) ? this.refs_[ref] : null);
    }

    public GetRefElements(){
        return this.refs_;
    }

    public AddAttributeChangeCallback(element: HTMLElement, callback: (list: Array<IMutationObserverAttributeInfo>) => void){
        this.attributeObservers_.push({ element, callback });
        this.NotifyListeners_('attribute-observers', this.attributeObservers_);
    }

    public RemoveAttributeChangeCallback(element: HTMLElement, callback?: (nlist: Array<IMutationObserverAttributeInfo>) => void){
        this.attributeObservers_ = this.attributeObservers_.filter(info => (info.element !== element && info.callback !== callback));
        this.NotifyListeners_('attribute-observers', this.attributeObservers_);
    }

    public AddIntersectionObserver(observer: IIntersectionObserver){
        this.observers_.intersections[observer.GetId()] = observer;
        this.NotifyListeners_('intersection-observers', this.observers_.intersections);
    }

    public FindIntersectionObserver(id: string){
        return ((id in this.observers_.intersections) ? this.observers_.intersections[id] : null);
    }

    public RemoveIntersectionObserver(id: string){
        if (id in this.observers_.intersections){
            delete this.observers_.intersections[id];
            this.NotifyListeners_('intersection-observers', this.observers_.intersections);
        }
    }

    public GetBackend(): IComponentBackend{
        return {
            context: this.context_,
            changes: this.changes_,
        };
    }

    public GetGlobal(){
        return GetGlobal();
    }
}
