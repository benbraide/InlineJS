var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { BaseComponent } from "../component/base";
import { ChangesMonitor } from "../component/changes-monitor";
import { SetProxyAccessHandler } from "../component/set-proxy-access-handler";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ResizeObserver } from "../observers/resize";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { RandomString } from "../utilities/random-string";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";
export class BaseGlobal extends ChangesMonitor {
    constructor(configOptions, idOffset = 0) {
        super();
        this.nothing_ = new Nothing;
        this.storedObjects_ = {};
        this.lastStoredObjectKey_ = '';
        this.componentsMonitorList_ = new Array();
        this.components_ = {};
        this.currentComponent_ = new Stack();
        this.scopeContext_ = new Stack();
        this.attributeProcessors_ = new Array();
        this.textContentProcessors_ = new Array();
        this.customElements_ = {};
        this.managers_ = {
            directive: new DirectiveManager(),
            magic: new MagicManager(),
        };
        this.uniqueMarkers_ = GetDefaultUniqueMarkers();
        this.mutationObserver_ = new MutationObserver();
        this.resizeObserver_ = new ResizeObserver();
        this.nativeFetch_ = new NativeFetchConcept();
        this.fetchConcept_ = null;
        this.concepts_ = {};
        this.config_ = new Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }
    SwapConfig(config) {
        this.NotifyListeners_('config', (this.config_ = config));
    }
    GetConfig() {
        return this.config_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
        this.NotifyListeners_('unique-markers', this.uniqueMarkers_);
        return generated;
    }
    StoreObject({ object, componentId, contextElement }) {
        var _a;
        this.lastStoredObjectKey_ = `@!@${RandomString(18)}@!@`;
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
        const component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        this.componentsMonitorList_.forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.NotifyListeners_('components', this.components_);
        return component;
    }
    RemoveComponent(component) {
        const key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)) {
            const component = this.components_[key];
            delete this.components_[key];
            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.NotifyListeners_('components', this.components_);
        }
    }
    TraverseComponents(callback) {
        Object.values(this.components_).some(component => (callback(component) === false));
    }
    FindComponentById(id) {
        return ((id && id in this.components_) ? this.components_[id] : null);
    }
    FindComponentByName(name) {
        return ((name && Object.values(this.components_).find(component => (component.GetName() === name))) || null);
    }
    FindComponentByRoot(root) {
        return ((root && Object.values(this.components_).find(component => (component.GetRoot() === root))) || null);
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
    DispatchAttributeProcessing(_a) {
        var { componentId, component, contextElement, proxyAccessHandler } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "proxyAccessHandler"]);
        const resolvedComponent = (component || this.FindComponentById(componentId)), pahCallback = SetProxyAccessHandler(resolvedComponent, (proxyAccessHandler || null));
        this.attributeProcessors_.forEach((processor) => {
            JournalTry(() => processor(Object.assign({ componentId, component, contextElement, proxyAccessHandler }, rest)), 'InlineJS.Global.DispatchAttribute', contextElement);
        });
        pahCallback();
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
        this.NotifyListeners_('text-content-processors', this.textContentProcessors_);
    }
    DispatchTextContentProcessing(_a) {
        var { componentId, component, contextElement, proxyAccessHandler } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "proxyAccessHandler"]);
        const resolvedComponent = (component || this.FindComponentById(componentId)), pahCallback = SetProxyAccessHandler(resolvedComponent, (proxyAccessHandler || null));
        this.textContentProcessors_.forEach((processor) => {
            JournalTry(() => processor(Object.assign({ componentId, component, contextElement, proxyAccessHandler }, rest)), 'InlineJS.Global.DispatchTextContent', contextElement);
        });
        pahCallback();
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
        return new ChildProxy(owner, name, target);
    }
    CreateFuture(callback) {
        return new Future(callback);
    }
    IsFuture(value) {
        return (value instanceof Future);
    }
    CreateNothing() {
        return this.nothing_;
    }
    IsNothing(value) {
        return (value instanceof Nothing);
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
}
