"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGlobal = void 0;
const base_1 = require("../component/base");
const changes_monitor_1 = require("../component/changes-monitor");
const cache_1 = require("../component/cache");
const set_proxy_access_handler_1 = require("../component/set-proxy-access-handler");
const manager_1 = require("../directive/manager");
const try_1 = require("../journal/try");
const manager_2 = require("../magic/manager");
const mutation_1 = require("../observers/mutation");
const resize_1 = require("../observers/resize");
const child_1 = require("../proxy/child");
const stack_1 = require("../stack");
const random_string_1 = require("../utilities/random-string");
const unique_markers_1 = require("../utilities/unique-markers");
const future_1 = require("../values/future");
const nothing_1 = require("../values/nothing");
const config_1 = require("./config");
const native_fetch_1 = require("./native-fetch");
const get_access_1 = require("../storage/get-access");
const range_1 = require("../values/range");
class BaseGlobal extends changes_monitor_1.ChangesMonitor {
    constructor(configOptions, idOffset = 0) {
        super();
        this.nothing_ = new nothing_1.Nothing;
        this.currentProxyAccessStorage_ = null;
        this.storedObjects_ = {};
        this.lastStoredObjectKey_ = '';
        this.componentsMonitorList_ = new Array();
        this.components_ = {};
        this.currentComponent_ = new stack_1.Stack();
        this.scopeContext_ = new stack_1.Stack();
        this.attributeProcessors_ = new Array();
        this.textContentProcessors_ = new Array();
        this.customElements_ = {};
        this.managers_ = {
            directive: new manager_1.DirectiveManager(),
            magic: new manager_2.MagicManager(),
        };
        this.uniqueMarkers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        this.mutationObserver_ = new mutation_1.MutationObserver();
        this.resizeObserver_ = new resize_1.ResizeObserver();
        this.nativeFetch_ = new native_fetch_1.NativeFetchConcept();
        this.fetchConcept_ = null;
        this.concepts_ = {};
        this.config_ = new config_1.Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }
    SwapConfig(config) {
        this.NotifyListeners_('config', (this.config_ = config));
    }
    GetConfig() {
        return this.config_;
    }
    SetCurrentProxyAccessStorage(storage) {
        const old = this.currentProxyAccessStorage_;
        this.currentProxyAccessStorage_ = storage;
        return old;
    }
    GetCurrentProxyAccessStorage() {
        return this.currentProxyAccessStorage_;
    }
    UseProxyAccessStorage(callback, storage) {
        storage = storage || new get_access_1.ProxyAccessStorage();
        const old = this.SetCurrentProxyAccessStorage(storage);
        const result = (0, try_1.JournalTry)(() => callback(storage), 'InlineJS.Global.UseProxyAccessStorage');
        this.SetCurrentProxyAccessStorage(old);
        return result;
    }
    SuspendProxyAccessStorage(callback) {
        const current = this.currentProxyAccessStorage_;
        current === null || current === void 0 ? void 0 : current.Suspend();
        const result = (0, try_1.JournalTry)(() => callback());
        current === null || current === void 0 ? void 0 : current.Resume();
        return result;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_, '', prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }
    StoreObject({ object, componentId, contextElement }) {
        var _a;
        this.lastStoredObjectKey_ = `@!@${(0, random_string_1.RandomString)(18)}@!@`;
        if (contextElement) {
            const scope = (_a = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
            if (scope) {
                scope.SetLocal(this.lastStoredObjectKey_, object);
                return this.lastStoredObjectKey_;
            }
        }
        this.storedObjects_[this.lastStoredObjectKey_] = object;
        this.NotifyListeners_('stored-objects', this.storedObjects_);
        return this.lastStoredObjectKey_;
    }
    RetrieveObject(params) {
        return this.RetrieveObject_(params, true);
    }
    PeekObject(params) {
        return this.RetrieveObject_(params, false);
    }
    GetLastObjectKey() {
        return this.lastStoredObjectKey_;
    }
    AddComponentMonitor(monitor) {
        this.componentsMonitorList_.push(monitor);
        this.NotifyListeners_('components-monitors', this.componentsMonitorList_);
    }
    RemoveComponentMonitor(monitor) {
        const len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.NotifyListeners_('components-monitors', this.componentsMonitorList_);
    }
    CreateComponent(root) {
        const existing = this.InferComponentFrom(root);
        if (existing) {
            return existing;
        }
        const component = new base_1.BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        this.componentsMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.NotifyListeners_('components', this.components_);
        return component;
    }
    RemoveComponent(component) {
        const key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)) {
            const component = this.components_[key];
            delete this.components_[key];
            component.Destroy();
            (0, cache_1.InvalidateComponentCache)(key);
            this.componentsMonitorList_.slice(0).forEach(monitor => (0, try_1.JournalTry)(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.NotifyListeners_('components', this.components_);
        }
    }
    TraverseComponents(callback) {
        Object.values(this.components_).some(component => (callback(component) === false));
    }
    FindComponentById(id) {
        return (id && this.components_.hasOwnProperty(id)) ? this.components_[id] : null;
    }
    FindComponentByName(name) {
        return (name && Object.values(this.components_).find(component => (component.GetName() === name))) || null;
    }
    FindComponentByRoot(root) {
        return (root && Object.values(this.components_).find(component => (component.GetRoot() === root))) || null;
    }
    FindComponentByCallback(callback) {
        return Object.values(this.components_).find(callback) || null;
    }
    PushCurrentComponent(componentId) {
        this.currentComponent_.Push(componentId);
        this.NotifyListeners_('current-component', this.currentComponent_);
    }
    PopCurrentComponent() {
        const isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
        !isEmpty && this.NotifyListeners_('current-component', this.currentComponent_);
        return popped;
    }
    PeekCurrentComponent() {
        return this.currentComponent_.Peek();
    }
    GetCurrentComponent() {
        return this.FindComponentById(this.PeekCurrentComponent() || '');
    }
    InferComponentFrom(element) {
        return ((element && Object.values(this.components_).find(component => (component.GetRoot() === element || component.GetRoot().contains(element)))) || null);
    }
    PushScopeContext(scope) {
        this.scopeContext_.Push(scope);
        this.NotifyListeners_('scope-context', this.scopeContext_);
    }
    PopScopeContext() {
        const isEmpty = this.scopeContext_.IsEmpty(), popped = this.scopeContext_.Pop();
        !isEmpty && this.NotifyListeners_('scope-context', this.scopeContext_);
        return popped;
    }
    PeekScopeContext() {
        return this.scopeContext_.Peek();
    }
    GetDirectiveManager() {
        return this.managers_.directive;
    }
    GetMagicManager() {
        return this.managers_.magic;
    }
    AddAttributeProcessor(processor) {
        this.attributeProcessors_.push(processor);
        this.NotifyListeners_('attribute-processors', this.attributeProcessors_);
    }
    DispatchAttributeProcessing(params) {
        this.DispatchProcessing_(this.attributeProcessors_, params, 'InlineJS.Global.DispatchAttribute');
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
        this.NotifyListeners_('text-content-processors', this.textContentProcessors_);
    }
    DispatchTextContentProcessing(params) {
        this.DispatchProcessing_(this.textContentProcessors_, params, 'InlineJS.Global.DispatchTextContent');
    }
    GetMutationObserver() {
        return this.mutationObserver_;
    }
    GetResizeObserver() {
        return this.resizeObserver_;
    }
    SetFetchConcept(concept) {
        this.fetchConcept_ = concept;
        this.NotifyListeners_('fetch-concept', this.fetchConcept_);
    }
    GetFetchConcept() {
        return (this.fetchConcept_ || this.nativeFetch_);
    }
    SetConcept(name, concept) {
        this.concepts_[name] = concept;
        this.NotifyListeners_('concepts', this.concepts_);
    }
    RemoveConcept(name) {
        delete this.concepts_[name];
        this.NotifyListeners_('concepts', this.concepts_);
    }
    GetConcept(name) {
        return (this.concepts_.hasOwnProperty(name) ? this.concepts_[name] : null);
    }
    AddCustomElement(name, constructor) {
        if (this.customElements_.hasOwnProperty(name)) { //Already exists
            return;
        }
        this.customElements_[name] = constructor;
        customElements.define(this.config_.GetElementName(name), constructor);
        this.NotifyListeners_('custom-elements', this.customElements_);
    }
    FindCustomElement(name) {
        return (this.customElements_.hasOwnProperty(name) ? this.customElements_[name] : null);
    }
    CreateChildProxy(owner, name, target) {
        return new child_1.ChildProxy(owner, name, target);
    }
    CreateFuture(callback) {
        return new future_1.Future(callback);
    }
    IsFuture(value) {
        return (value instanceof future_1.Future);
    }
    CreateNothing() {
        return this.nothing_;
    }
    IsNothing(value) {
        return (value instanceof nothing_1.Nothing);
    }
    CreateRange(from, to) {
        return new range_1.Range(from, to);
    }
    IsRange(value) {
        return value instanceof range_1.Range;
    }
    RetrieveObject_({ key, componentId, contextElement }, remove) {
        if (contextElement) {
            const component = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement));
            if (component) {
                const found = component.FindElementLocal(contextElement, key, true);
                if (found) {
                    const value = found.GetLocal(key);
                    if (remove) {
                        found.DeleteLocal(key);
                        (key === this.lastStoredObjectKey_) && (this.lastStoredObjectKey_ = '');
                    }
                    return value;
                }
            }
        }
        if (this.storedObjects_.hasOwnProperty(key)) {
            const value = this.storedObjects_[key];
            if (remove) {
                (key === this.lastStoredObjectKey_) && (this.lastStoredObjectKey_ = '');
                delete this.storedObjects_[key];
                this.NotifyListeners_('stored-objects', this.storedObjects_);
            }
            return value;
        }
        return this.CreateNothing();
    }
    DispatchProcessing_(processors, params, contextString) {
        const resolvedComponent = (params.component || this.FindComponentById(params.componentId)), pahCallback = (0, set_proxy_access_handler_1.SetProxyAccessHandler)(resolvedComponent, (params.proxyAccessHandler || null));
        processors.forEach((processor) => {
            (0, try_1.JournalTry)(() => processor(params), contextString, params.contextElement);
        });
        pahCallback();
    }
}
exports.BaseGlobal = BaseGlobal;
