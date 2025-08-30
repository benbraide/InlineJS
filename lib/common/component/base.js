"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponent = void 0;
const process_1 = require("../directive/process");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const root_1 = require("../proxy/root");
const stack_1 = require("../stack");
const context_keys_1 = require("../utilities/context-keys");
const unique_markers_1 = require("../utilities/unique-markers");
const changes_1 = require("./changes");
const changes_monitor_1 = require("./changes-monitor");
const context_1 = require("./context");
const element_scope_1 = require("./element-scope");
const element_scope_id_1 = require("./element-scope-id");
const find_1 = require("./find");
const get_config_1 = require("./get-config");
const scope_1 = require("./scope");
class BaseComponent extends changes_monitor_1.ChangesMonitor {
    constructor(id_, root_) {
        super();
        this.id_ = id_;
        this.root_ = root_;
        this.isDestroying_ = false;
        this.isDestroyed_ = false;
        this.reactiveState_ = 'default';
        this.name_ = '';
        this.proxyAccessHandler_ = null;
        this.context_ = new context_1.Context;
        this.scopes_ = {};
        this.elementScopes_ = {};
        this.proxies_ = {};
        this.refs_ = {};
        this.currentScope_ = new stack_1.Stack();
        this.selectionScopes_ = new stack_1.Stack();
        this.uniqueMarkers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        this.attributeObservers_ = new Array();
        this.observers_ = {
            intersections: {},
        };
        this.changes_ = new changes_1.Changes(this.id_);
        this.rootProxy_ = new root_1.RootProxy(this.id_, {});
        this.proxies_[this.rootProxy_.GetPath()] = this.rootProxy_;
        (0, get_1.GetGlobal)().GetMutationObserver().Observe(this.root_, ({ added, removed, attributes }) => {
            const component = (0, find_1.FindComponentById)(id_);
            if (!component) {
                return;
            }
            const checklist = new Array(), dirRegex = (0, get_1.GetGlobal)().GetConfig().GetDirectiveRegex();
            const filteredAttributes = attributes === null || attributes === void 0 ? void 0 : attributes.filter(attr => (attr.target instanceof HTMLElement));
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
                    const list = filteredAttributes.filter(attr => (attr.target === info.element || info.element.contains(attr.target)));
                    (list.length != 0) && (0, try_1.JournalTry)(() => info.callback(list));
                });
            }
            checklist.forEach(element => (0, process_1.ProcessDirectives)({ element,
                component: component,
                options: {
                    checkTemplate: true,
                    checkDocument: false,
                    ignoreChildren: false,
                }, }));
            const addedBackup = [...(added || [])];
            added === null || added === void 0 ? void 0 : added.filter(node => !(removed === null || removed === void 0 ? void 0 : removed.includes(node))).forEach((node) => {
                var _a;
                if (node instanceof HTMLElement && !component.FindElementScope(node)) {
                    (0, process_1.ProcessDirectives)({
                        component: component,
                        element: node,
                        options: {
                            checkTemplate: true,
                            checkDocument: false,
                            ignoreChildren: false,
                        },
                    });
                    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
                        (_a = component.FindElementScope(parent)) === null || _a === void 0 ? void 0 : _a.ExecuteTreeChangeCallbacks([node], []);
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
    Destroy() {
        if (this.isDestroying_ || this.isDestroyed_) {
            return;
        }
        this.isDestroying_ = true;
        this.reactiveState_ = 'default';
        this.name_ = '';
        this.proxyAccessHandler_ = null;
        this.context_.Purge();
        (0, try_1.JournalTry)(() => this.changes_.Destroy());
        Object.values(this.scopes_).forEach(scope => (0, try_1.JournalTry)(() => scope.Destroy()));
        this.scopes_ = {};
        Object.values(this.elementScopes_).forEach(scope => (0, try_1.JournalTry)(() => scope.Destroy()));
        this.elementScopes_ = {};
        (0, try_1.JournalTry)(() => this.rootProxy_.Destroy());
        this.refs_ = {};
        Object.values(this.proxies_).forEach(proxy => (0, try_1.JournalTry)(() => proxy.Destroy()));
        this.proxies_ = {};
        this.currentScope_.Purge();
        this.selectionScopes_.Purge();
        this.uniqueMarkers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        this.attributeObservers_ = [];
        Object.values(this.observers_.intersections).forEach(observer => (0, try_1.JournalTry)(() => observer.Destroy()));
        this.observers_.intersections = {};
        this.isDestroyed_ = true;
        this.isDestroying_ = false;
    }
    IsDestroyed() {
        return this.isDestroying_ || this.isDestroyed_;
        ;
    }
    SetReactiveState(state) {
        this.NotifyListeners_('reactive-state', (this.reactiveState_ = state));
    }
    GetReactiveState() {
        return ((this.reactiveState_ === 'default') ? (0, get_config_1.GetConfig)().GetReactiveState() : this.reactiveState_);
    }
    GetId() {
        return this.id_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_, `Cmpnt<${this.id_}>.`, prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }
    SetName(name) {
        this.NotifyListeners_('name', (this.name_ = name));
    }
    GetName() {
        return this.name_;
    }
    SetProxyAccessHandler(handler) {
        const oldHandler = this.proxyAccessHandler_;
        this.proxyAccessHandler_ = handler;
        this.NotifyListeners_('proxy-access-handler', this.proxyAccessHandler_);
        return oldHandler;
    }
    GetProxyAccessHandler() {
        return this.proxyAccessHandler_;
    }
    CreateScope(root) {
        const existing = Object.values(this.scopes_).find(scope => (scope.GetRoot() === root));
        if (existing) {
            return existing;
        }
        if (root === this.root_ || !this.root_.contains(root)) {
            return null;
        }
        const scope = new scope_1.Scope(this.id_, this.GenerateUniqueId('scope_'), root);
        this.scopes_[scope.GetId()] = scope;
        this.AddProxy(scope.GetProxy());
        this.NotifyListeners_('scopes', this.scopes_);
        return scope;
    }
    RemoveScope(scope) {
        const id = ((typeof scope === 'string') ? scope : scope.GetId());
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
        const isEmpty = this.currentScope_.IsEmpty(), popped = this.currentScope_.Pop();
        !isEmpty && this.NotifyListeners_('current-scope', this.currentScope_);
        return popped;
    }
    PeekCurrentScope() {
        return this.currentScope_.Peek();
    }
    InferScopeFrom(element) {
        const scopeContext = (0, get_1.GetGlobal)().PeekScopeContext();
        if (scopeContext) {
            return scopeContext;
        }
        let matched = null;
        for (const key in this.scopes_) {
            const scope = this.scopes_[key], root = scope.GetRoot();
            if (root === element) { //Exact match
                return scope;
            }
            if (root.contains(element) && (!matched || matched.GetRoot().contains(root))) { //Contained match
                matched = scope;
            }
        }
        return matched;
    }
    PushSelectionScope() {
        const scope = {
            set: false,
        };
        this.selectionScopes_.Push(scope);
        this.NotifyListeners_('selection-scopes', this.selectionScopes_);
        return scope;
    }
    PopSelectionScope() {
        const isEmpty = this.selectionScopes_.IsEmpty(), popped = this.selectionScopes_.Pop();
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
        const existing = Object.values(this.elementScopes_).find(scope => (scope.GetElement() === element));
        if (existing) {
            return existing;
        }
        if (element !== this.root_ && !this.root_.contains(element)) {
            return null;
        }
        const elementScope = new element_scope_1.ElementScope(this.id_, this.GenerateUniqueId('elscope_'), element, element === this.root_, this, (scope) => {
            this.elementScopes_[scope.GetId()] = scope;
        });
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
        const target = ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_));
        if (target && element_scope_id_1.ElementScopeKey in target && typeof target[element_scope_id_1.ElementScopeKey] === 'string' && target[element_scope_id_1.ElementScopeKey] in this.elementScopes_) {
            return this.elementScopes_[target[element_scope_id_1.ElementScopeKey]];
        }
        return null;
    }
    FindElementLocal(element, key, shouldBubble) {
        const elementScope = this.FindElementScope(element);
        if (elementScope === null || elementScope === void 0 ? void 0 : elementScope.HasLocal(key)) {
            return elementScope;
        }
        if (!shouldBubble || (!elementScope && typeof element === 'string')) {
            return null;
        }
        const target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target) {
            return null;
        }
        const ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocal(ancestor, key, true) : null);
    }
    FindElementLocalValue(element, key, shouldBubble) {
        const elementScope = this.FindElementScope(element), value = (elementScope ? elementScope.GetLocal(key) : (0, get_1.GetGlobal)().CreateNothing());
        if (!(0, get_1.GetGlobal)().IsNothing(value) || !shouldBubble || (!elementScope && typeof element === 'string')) {
            return value;
        }
        const target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target) {
            return value;
        }
        const ancestor = this.FindAncestor(target);
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
        const path = ((typeof proxy === 'string') ? proxy : proxy.GetPath());
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
        this.attributeObservers_ = this.attributeObservers_.filter(info => info.element !== element || (callback && info.callback !== callback));
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
        return (0, get_1.GetGlobal)();
    }
}
exports.BaseComponent = BaseComponent;
