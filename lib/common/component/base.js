"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponent = void 0;
const create_1 = require("../directive/create");
const dispatch_1 = require("../directive/dispatch");
const process_1 = require("../directive/process");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const root_1 = require("../proxy/root");
const stack_1 = require("../stack");
const context_keys_1 = require("../utilities/context-keys");
const get_attribute_1 = require("../utilities/get-attribute");
const unique_markers_1 = require("../utilities/unique-markers");
const changes_1 = require("./changes");
const context_1 = require("./context");
const element_scope_1 = require("./element-scope");
const element_scope_id_1 = require("./element-scope-id");
const find_1 = require("./find");
const get_config_1 = require("./get-config");
const scope_1 = require("./scope");
class BaseComponent {
    constructor(id_, root_) {
        this.id_ = id_;
        this.root_ = root_;
        this.reactiveState_ = 'default';
        this.name_ = '';
        this.changesMonitorList_ = new Array();
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
        this.CreateElementScope(this.root_);
        (0, get_1.GetGlobal)().GetMutationObserver().Observe(this.root_, ({ added, removed, attributes }) => {
            let component = (0, find_1.FindComponentById)(id_);
            if (!component) {
                return;
            }
            let checklist = new Array(), dirRegex = (0, get_1.GetGlobal)().GetConfig().GetDirectiveRegex();
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
            let addedBackup = [...(added || [])];
            added === null || added === void 0 ? void 0 : added.filter(node => !(removed === null || removed === void 0 ? void 0 : removed.includes(node))).forEach((node) => {
                var _a;
                if (node instanceof HTMLElement) {
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
        this.reactiveState_ = state;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'reactive-state',
            object: () => this.reactiveState_,
        })));
    }
    GetReactiveState() {
        return ((this.reactiveState_ === 'default') ? (0, get_config_1.GetConfig)().GetReactiveState() : this.reactiveState_);
    }
    GetId() {
        return this.id_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_, `Cmpnt<${this.id_}>.`, prefix, suffix);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'markers',
            object: () => { return Object.assign({}, this.uniqueMarkers_); },
        })));
        return generated;
    }
    SetName(name) {
        this.name_ = name;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'name',
            object: () => this.name_,
        })));
    }
    GetName() {
        return this.name_;
    }
    AddChangesMonitor(monitor) {
        this.changesMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        })));
    }
    RemoveChangesMonitor(monitor) {
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        })));
    }
    CreateScope(root) {
        let existing = Object.values(this.scopes_).find(scope => (scope.GetRoot() === root));
        if (existing) {
            return existing;
        }
        if (root === this.root_ || !this.root_.contains(root)) {
            return null;
        }
        let scope = new scope_1.Scope(this.id_, this.GenerateUniqueId('scope_'), root);
        this.scopes_[scope.GetId()] = scope;
        this.AddProxy(scope.GetProxy());
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'scopes',
            object: () => { return Object.assign({}, this.scopes_); },
        })));
        return scope;
    }
    RemoveScope(scope) {
        let id = ((typeof scope === 'string') ? scope : scope.GetId());
        if (this.scopes_.hasOwnProperty(id)) {
            this.RemoveProxy(this.scopes_[id].GetProxy());
            delete this.scopes_[id];
            this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
                target: 'scopes',
                object: () => { return Object.assign({}, this.scopes_); },
            })));
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'current-scope',
            object: () => this.currentScope_,
        })));
    }
    PopCurrentScope() {
        let isEmpty = this.currentScope_.IsEmpty(), popped = this.currentScope_.Pop();
        !isEmpty && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'current-scope',
            object: () => this.currentScope_,
        })));
        return popped;
    }
    PeekCurrentScope() {
        return this.currentScope_.Peek();
    }
    InferScopeFrom(element) {
        var _a;
        return (this.FindScopeById(((_a = this.FindElementScope((0, element_scope_id_1.GetElementScopeId)(element))) === null || _a === void 0 ? void 0 : _a.GetScopeId()) || '') || null);
    }
    PushSelectionScope() {
        let scope = {
            set: false,
        };
        this.selectionScopes_.Push(scope);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'selection-scopes',
            object: () => this.selectionScopes_,
        })));
        return scope;
    }
    PopSelectionScope() {
        let isEmpty = this.selectionScopes_.IsEmpty(), popped = this.selectionScopes_.Pop();
        !isEmpty && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'selection-scopes',
            object: () => this.selectionScopes_,
        })));
        return popped;
    }
    PeekSelectionScope() {
        return this.selectionScopes_.Peek();
    }
    GetRoot() {
        return this.root_;
    }
    FindElement(deepestElement, predicate) {
        if (deepestElement === this.root_ || !this.root_.contains(deepestElement)) {
            return null;
        }
        do {
            deepestElement = deepestElement.parentElement;
            try {
                if (predicate(deepestElement)) {
                    return deepestElement;
                }
            }
            catch (_a) { }
        } while (deepestElement !== this.root_);
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
        let elementScope = new element_scope_1.ElementScope(this.id_, this.GenerateUniqueId('elscope_'), element, (element === this.root_));
        this.elementScopes_[elementScope.GetId()] = elementScope;
        element[element_scope_id_1.ElementScopeKey] = elementScope.GetId();
        let processDirective = (name) => {
            let info = (0, get_attribute_1.FindFirstAttribute)(element, [(0, get_config_1.GetConfig)().GetDirectiveName(name, false), (0, get_config_1.GetConfig)().GetDirectiveName(name, true)]);
            if (info) {
                let directive = (0, create_1.CreateDirective)(info.name, info.value);
                directive && (0, dispatch_1.DispatchDirective)(this, element, directive);
            }
        };
        ['data', 'component', 'ref', 'init'].forEach(dir => processDirective(dir));
        elementScope.SetInitialized();
        if ('OnElementScopeCreated' in element && typeof element.OnElementScopeCreated === 'function') {
            (0, try_1.JournalTry)(() => element.OnElementScopeCreated({
                componentId: this.id_,
                component: this,
                scope: elementScope,
            }));
        }
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'element-scopes',
            object: () => { return Object.assign({}, this.elementScopes_); },
        })));
        return elementScope;
    }
    RemoveElementScope(id) {
        delete this.elementScopes_[id];
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'element-scopes',
            object: () => { return Object.assign({}, this.elementScopes_); },
        })));
    }
    FindElementScope(element) {
        if (typeof element === 'string') {
            return ((element in this.elementScopes_) ? this.elementScopes_[element] : null);
        }
        let target = ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_));
        if (target && element_scope_id_1.ElementScopeKey in target && typeof target[element_scope_id_1.ElementScopeKey] === 'string' && target[element_scope_id_1.ElementScopeKey] in this.elementScopes_) {
            return this.elementScopes_[target[element_scope_id_1.ElementScopeKey]];
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
        let target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
        if (!target) {
            return null;
        }
        let ancestor = this.FindAncestor(target);
        return (ancestor ? this.FindElementLocal(ancestor, key, true) : null);
    }
    FindElementLocalValue(element, key, shouldBubble) {
        let elementScope = this.FindElementScope(element), value = (elementScope ? elementScope.GetLocal(key) : (0, get_1.GetGlobal)().CreateNothing());
        if (!(0, get_1.GetGlobal)().IsNothing(value) || !shouldBubble || (!elementScope && typeof element === 'string')) {
            return value;
        }
        let target = ((elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetElement()) || ((element === true) ? this.context_.Peek(context_keys_1.ContextKeys.self) : ((element instanceof Node) ? element : this.root_)));
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'proxies',
            object: () => { return Object.assign({}, this.proxies_); },
        })));
    }
    RemoveProxy(proxy) {
        let path = ((typeof proxy === 'string') ? proxy : proxy.GetPath());
        if (this.proxies_.hasOwnProperty(path)) {
            delete this.proxies_[path];
            this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
                target: 'proxies',
                object: () => { return Object.assign({}, this.proxies_); },
            })));
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'refs',
            object: () => { return Object.assign({}, this.refs_); },
        })));
    }
    FindRefElement(ref) {
        return ((ref in this.refs_) ? this.refs_[ref] : null);
    }
    AddAttributeChangeCallback(element, callback) {
        this.attributeObservers_.push({ element, callback });
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'attribute-observers',
            object: () => { return Object.assign({}, this.attributeObservers_); },
        })));
    }
    RemoveAttributeChangeCallback(element, callback) {
        this.attributeObservers_ = this.attributeObservers_.filter(info => (info.element !== element && info.callback !== callback));
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'attribute-observers',
            object: () => { return Object.assign({}, this.attributeObservers_); },
        })));
    }
    AddIntersectionObserver(observer) {
        this.observers_.intersections[observer.GetId()] = observer;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'intersection-observers',
            object: () => { return Object.assign({}, this.observers_.intersections); },
        })));
    }
    FindIntersectionObserver(id) {
        return ((id in this.observers_.intersections) ? this.observers_.intersections[id] : null);
    }
    RemoveIntersectionObserver(id) {
        if (id in this.observers_.intersections) {
            delete this.observers_.intersections[id];
            this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
                target: 'intersection-observers',
                object: () => { return Object.assign({}, this.observers_.intersections); },
            })));
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
