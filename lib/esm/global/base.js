import { BaseComponent } from "../component/base";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";
export class BaseGlobal {
    constructor(configOptions, idOffset = 0) {
        this.nothing_ = new Nothing;
        this.componentsMonitorList_ = new Array();
        this.components_ = {};
        this.currentComponent_ = new Stack();
        this.attributeProcessors_ = new Array();
        this.textContentProcessors_ = new Array();
        this.managers_ = {
            directive: new DirectiveManager(),
            magic: new MagicManager(),
        };
        this.uniqueMarkers_ = GetDefaultUniqueMarkers();
        this.mutationObserver_ = new MutationObserver();
        this.nativeFetch_ = new NativeFetchConcept();
        this.fetchConcept_ = null;
        this.concepts_ = {};
        this.config_ = new Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }
    SwapConfig(config) {
        this.config_ = config;
    }
    GetConfig() {
        return this.config_;
    }
    GenerateUniqueId(prefix, suffix) {
        return GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
    }
    AddComponentMonitor(monitor) {
        this.componentsMonitorList_.push(monitor);
    }
    RemoveComponentMonitor(monitor) {
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
    }
    CreateComponent(root) {
        let existing = this.InferComponentFrom(root);
        if (existing) {
            return existing;
        }
        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        return component;
    }
    RemoveComponent(component) {
        let key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)) {
            let component = this.components_[key];
            delete this.components_[key];
            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
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
    }
    PopCurrentComponent() {
        return this.currentComponent_.Pop();
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
    GetDirectiveManager() {
        return this.managers_.directive;
    }
    GetMagicManager() {
        return this.managers_.magic;
    }
    AddAttributeProcessor(processor) {
        this.attributeProcessors_.push(processor);
    }
    DispatchAttributeProcessing(params) {
        this.attributeProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
    }
    DispatchTextContentProcessing(params) {
        this.textContentProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }
    GetMutationObserver() {
        return this.mutationObserver_;
    }
    SetFetchConcept(concept) {
        this.fetchConcept_ = concept;
    }
    GetFetchConcept() {
        return (this.fetchConcept_ || this.nativeFetch_);
    }
    SetConcept(name, concept) {
        this.concepts_[name] = concept;
    }
    RemoveConcept(name) {
        delete this.concepts_[name];
    }
    GetConcept(name) {
        return (this.concepts_.hasOwnProperty(name) ? this.concepts_[name] : null);
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
}
