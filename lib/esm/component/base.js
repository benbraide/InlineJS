import { CreateDirective } from "../directive/create";
import { DispatchDirective } from "../directive/dispatch";
import { ProcessDirectives } from "../directive/process";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { RootProxy } from "../proxy/root";
import { Stack } from "../stack";
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
export class BaseComponent extends ChangesMonitor {
    constructor(id_, root_) {
        super();
        this.id_ = id_;
        this.root_ = root_;
        this.reactiveState_ = 'default';
        this.name_ = '';
        this.context_ = new Context;
        this.scopes_ = {};
        this.elementScopes_ = {};
        this.proxies_ = {};
        this.refs_ = {};
        this.currentScope_ = new Stack();
        this.selectionScopes_ = new Stack();
        this.uniqueMarkers_ = GetDefaultUniqueMarkers();
        this.attributeObservers_ = new Array();
        this.observers_ = {
            intersections: {},
        };
        this.changes_ = new Changes(this.id_);
        this.rootProxy_ = new RootProxy(this.id_, {});
        this.proxies_[this.rootProxy_.GetPath()] = this.rootProxy_;
        GetGlobal().GetMutationObserver().Observe(this.root_, ({ added, removed, attributes }) => {
            let component = FindComponentById(id_);
            if (!component) {
                return;
            }
            let checklist = new Array(), dirRegex = GetGlobal().GetConfig().GetDirectiveRegex();
            let filteredAttributes = attributes === null || attributes === void 0 ? void 0 : attributes.filter(attr => (attr.target instanceof HTMLElement));
            filteredAttributes === null || filteredAttributes === void 0 ? void 0 : filteredAttributes.forEach((attr) => {
                var _a;
                if (!dirRegex.test(attr.name)) {
                    (_a = component === null || component === void 0 ? void 0 : component.FindElementScope(attr.target)) === null || _a === void 0 ? void 0 : _a.ExecuteAttributeChangeCallbacks(attr.name);
                }
                else if (attr.target.hasAttribute(attr.name) && !checklist.includes(attr.target)) {
                    checklist.push(attr.target);
                }
            });
            if (filteredAttributes) { //Alert listeners
                this.attributeObservers_.forEach((info) => {
                    let list = filteredAttributes.filter(attr => (attr.target === info.element || info.element.contains(attr.target)));
                    (list.length != 0) && JournalTry(() => info.callback(list));
                });
            }
            checklist.forEach(element => ProcessDirectives({ element,
                component: component,
                options: {
                    checkTemplate: true,
                    checkDocument: false,
                    ignoreChildren: false,
                }, }));
            let addedBackup = [...(added || [])];
            added === null || added === void 0 ? void 0 : added.filter(node => !(removed === null || removed === void 0 ? void 0 : removed.includes(node))).forEach((node) => {
                var _a;
                if (node instanceof HTMLElement) {
                    ProcessDirectives({
                        component: component,
                        element: node,
                        options: {
                            checkTemplate: true,
                            checkDocument: false,
                            ignoreChildren: false,
                        },
                    });
                    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
                        (_a = component === null || component === void 0 ? void 0 : component.FindElementScope(parent)) === null || _a === void 0 ? void 0 : _a.ExecuteTreeChangeCallbacks([node], []);
                        if (parent === this.root_) {
                            break;
                        }
                    }
                }
            });
            removed === null || removed === void 0 ? void 0 : removed.filter(node => !addedBackup.includes(node)).forEach((node) => {
                var _a;
                if (node instanceof HTMLElement) {
                    (_a = component.FindElementScope(node)) === null || _a === void 0 ? void 0 : _a.Destroy();
                }
            });
        }, ['add', 'remove', 'attribute']);
    }
    SetReactiveState(state) {
        this.NotifyListeners_('reactive-state', (this.reactiveState_ = state));
    }
    GetReactiveState() {
        return ((this.reactiveState_ === 'default') ? GetConfig().GetReactiveState() : this.reactiveState_);
    }
    GetId() {
        return this.id_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = GenerateUniqueId(this.uniqueMarkers_, `Cmpnt<${this.id_}>.`, prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }
    SetName(name) {
        this.NotifyListeners_('name', (this.name_ = name));
    }
    GetName() {
        return this.name_;
    }
    CreateScope(root) {
        let existing = Object.values(this.scopes_).find(scope => (scope.GetRoot() === root));
        if (existing) {
            return existing;
        }
        if (root === this.root_ || !this.root_.contains(root)) {
            return null;
        }
        let scope = new Scope(this.id_, this.GenerateUniqueId('scope_'), root);
        this.scopes_[scope.GetId()] = scope;
        this.AddProxy(scope.GetProxy());
        this.NotifyListeners_('scopes', this.scopes_);
        return scope;
    }
    RemoveScope(scope) {
        let id = ((typeof scope === 'string') ? scope : scope.GetId());
        if (this.scopes_.hasOwnProperty(id)) {
            this.RemoveProxy(this.scopes_[id].GetProxy());
            delete this.scopes_[id];
            this.NotifyListeners_('scopes', this.scopes_);
        }
    }
    FindScopeById(id) {
        return (this.scopes_.hasOwnProperty(id) ? this.scopes_[id] : null);
    }
    FindScopeByName(name) {
        return (Object.values(this.scopes_).find(scope => (scope.GetName() === name)) || null);
    }
    FindScopeByRoot(root) {
        return (Object.values(this.scopes_).find(scope => (scope.GetRoot() === root)) || null);
    }
    PushCurrentScope(scopeId) {
        this.currentScope_.Push(scopeId);
        this.NotifyListeners_('current-scope', this.currentScope_);
    }
    PopCurrentScope() {
        let isEmpty = this.currentScope_.IsEmpty(), popped = this.currentScope_.Pop();
        !isEmpty && this.NotifyListeners_('current-scope', this.currentScope_);
        return popped;
    }
    PeekCurrentScope() {
        return this.currentScope_.Peek();
    }
    InferScopeFrom(element) {
        var _a;
        return (this.FindScopeById(((_a = this.FindElementScope(GetElementScopeId(element))) === null || _a === void 0 ? void 0 : _a.GetScopeId()) || '') || null);
    }
    PushSelectionScope() {
        let scope = {
            set: false,
        };
        this.selectionScopes_.Push(scope);
        this.NotifyListeners_('selection-scopes', this.selectionScopes_);
        return scope;
    }
    PopSelectionScope() {
        let isEmpty = this.selectionScopes_.IsEmpty(), popped = this.selectionScopes_.Pop();
        !isEmpty && this.NotifyListeners_('selection-scopes', this.selectionScopes_);
        return popped;
    }
    PeekSelectionScope() {
        return this.selectionScopes_.Peek();
    }
    GetRoot() {
        return this.root_;
    }
    FindElement(target, predicate) {
        if (target === this.root_ || !this.root_.contains(target)) {
            return null;
        }
        for (let ancestor = target.parentNode; ancestor; ancestor = ancestor.parentNode) {
            try {
                if ((ancestor instanceof HTMLElement) && predicate(ancestor)) {
                    return ancestor;
                }
                if (ancestor === this.root_) {
                    break;
                }
            }
            catch (_a) {
                break;
            }
        }
        return null;
    }
    FindAncestor(target, index) {
        let realIndex = (index || 0);
        return this.FindElement(target, () => (realIndex-- == 0));
    }
    CreateElementScope(element) {
        let existing = Object.values(this.elementScopes_).find(scope => (scope.GetElement() === element));
        if (existing) {
            return existing;
        }
        if (element !== this.root_ && !this.root_.contains(element)) {
            return null;
        }
        let elementScope = new ElementScope(this.id_, this.GenerateUniqueId('elscope_'), element, (element === this.root_));
        this.elementScopes_[elementScope.GetId()] = elementScope;
        element[ElementScopeKey] = elementScope.GetId();
        let processDirective = (name) => {
            let info = FindFirstAttribute(element, [GetConfig().GetDirectiveName(name, false), GetConfig().GetDirectiveName(name, true)]);
            if (info) {
                let directive = CreateDirective(info.name, info.value);
                directive && DispatchDirective(this, element, directive);
            }
        };
        ['data', 'component', 'ref', 'locals', 'init'].forEach(dir => processDirective(dir));
        elementScope.SetInitialized();
        if ('OnElementScopeCreated' in element && typeof element.OnElementScopeCreated === 'function') {
            JournalTry(() => element.OnElementScopeCreated({
                componentId: this.id_,
                component: this,
                scope: elementScope,
            }));
        }
        this.NotifyListeners_('element-scopes', this.elementScopes_);
        return elementScope;
    }
    RemoveElementScope(id) {
        delete this.elementScopes_[id];
        this.NotifyListeners_('element-scopes', this.elementScopes_);
    }
    FindElementScope(element) {
        if (typeof element === 'string') {
            return ((element in this.elementScopes_) ? this.elementScopes_[element] : null);
        }
        let target = ((element === true) ? this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_));
        if (target && ElementScopeKey in target && typeof target[ElementScopeKey] === 'string' && target[ElementScopeKey] in this.elementScopes_) {
            return this.elementScopes_[target[ElementScopeKey]];
        }
        return null;
    }
    FindElementLocal(element, key, shouldBubble) {
        let elementScope = this.FindElementScope(element);
        if (elementScope === null || elementScope === void 0 ? void 0 : elementScope.HasLocal(key)) {
            return elementScope;
        }
        if (!shouldBubble || (!elementScope && typeof element === 'string')) {
            return null;
        }
        let target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target) {
            return null;
        }
        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocal(ancestor, key, true) : null);
    }
    FindElementLocalValue(element, key, shouldBubble) {
        let elementScope = this.FindElementScope(element), value = (elementScope ? elementScope.GetLocal(key) : GetGlobal().CreateNothing());
        if (!GetGlobal().IsNothing(value) || !shouldBubble || (!elementScope && typeof element === 'string')) {
            return value;
        }
        let target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target) {
            return value;
        }
        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocalValue(ancestor, key, true) : value);
    }
    SetElementLocalValue(element, key, value) {
        var _a;
        (_a = this.FindElementScope(element)) === null || _a === void 0 ? void 0 : _a.SetLocal(key, value);
    }
    DeleteElementLocalValue(element, key) {
        var _a;
        (_a = this.FindElementScope(element)) === null || _a === void 0 ? void 0 : _a.DeleteLocal(key);
    }
    AddProxy(proxy) {
        this.proxies_[proxy.GetPath()] = proxy;
        this.NotifyListeners_('proxies', this.proxies_);
    }
    RemoveProxy(proxy) {
        let path = ((typeof proxy === 'string') ? proxy : proxy.GetPath());
        if (this.proxies_.hasOwnProperty(path)) {
            delete this.proxies_[path];
            this.NotifyListeners_('proxies', this.proxies_);
        }
    }
    GetRootProxy() {
        return this.rootProxy_;
    }
    FindProxy(path) {
        return ((path in this.proxies_) ? this.proxies_[path] : null);
    }
    AddRefElement(ref, element) {
        this.refs_[ref] = element;
        this.NotifyListeners_('refs', this.refs_);
    }
    FindRefElement(ref) {
        return ((ref in this.refs_) ? this.refs_[ref] : null);
    }
    GetRefElements() {
        return this.refs_;
    }
    AddAttributeChangeCallback(element, callback) {
        this.attributeObservers_.push({ element, callback });
        this.NotifyListeners_('attribute-observers', this.attributeObservers_);
    }
    RemoveAttributeChangeCallback(element, callback) {
        this.attributeObservers_ = this.attributeObservers_.filter(info => (info.element !== element && info.callback !== callback));
        this.NotifyListeners_('attribute-observers', this.attributeObservers_);
    }
    AddIntersectionObserver(observer) {
        this.observers_.intersections[observer.GetId()] = observer;
        this.NotifyListeners_('intersection-observers', this.observers_.intersections);
    }
    FindIntersectionObserver(id) {
        return ((id in this.observers_.intersections) ? this.observers_.intersections[id] : null);
    }
    RemoveIntersectionObserver(id) {
        if (id in this.observers_.intersections) {
            delete this.observers_.intersections[id];
            this.NotifyListeners_('intersection-observers', this.observers_.intersections);
        }
    }
    GetBackend() {
        return {
            context: this.context_,
            changes: this.changes_,
        };
    }
    GetGlobal() {
        return GetGlobal();
    }
}
