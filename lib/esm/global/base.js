import { BaseComponent } from "../component/base";
import { DirectiveManager } from "../directive/manager";
import { JournalTry } from "../journal/try";
import { MagicManager } from "../magic/manager";
import { MutationObserver } from "../observers/mutation";
import { ChildProxy } from "../proxy/child";
import { Stack } from "../stack";
import { RandomString } from "../utilities/random-string";
import { GenerateUniqueId, GetDefaultUniqueMarkers } from "../utilities/unique-markers";
import { Future } from "../values/future";
import { Nothing } from "../values/nothing";
import { Config } from "./config";
import { NativeFetchConcept } from "./native-fetch";
export class BaseGlobal {
    constructor(configOptions, idOffset = 0) {
        this.nothing_ = new Nothing;
        this.storedObjects_ = {};
        this.changesMonitorList_ = new Array();
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
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'config',
            object: () => config,
        }), 'InlineJS.Global.ChangesMonitor::config'));
    }
    GetConfig() {
        return this.config_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = GenerateUniqueId(this.uniqueMarkers_, '', prefix, suffix);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'markers',
            object: () => { return Object.assign({}, this.uniqueMarkers_); },
        }), 'InlineJS.Global.ChangesMonitor::markers'));
        return generated;
    }
    StoreObject({ object, componentId, contextElement }) {
        var _a;
        const key = `@!@${RandomString(18)}@!@`;
        if (contextElement) {
            let scope = (_a = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
            if (scope) {
                scope.SetLocal(key, object);
                return key;
            }
        }
        this.storedObjects_[key] = object;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'stored-objects',
            object: () => { return Object.assign({}, this.storedObjects_); },
        }), 'InlineJS.Global.ChangesMonitor::stored-objects'));
        return key;
    }
    RetrieveObject(params) {
        return this.RetrieveObject_(params, true);
    }
    PeekObject(params) {
        return this.RetrieveObject_(params, false);
    }
    AddChangesMonitor(monitor) {
        this.changesMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }
    RemoveChangesMonitor(monitor) {
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }
    AddComponentMonitor(monitor) {
        this.componentsMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components-monitor',
            object: () => { return Object.assign({}, this.componentsMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }
    RemoveComponentMonitor(monitor) {
        let len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components-monitor',
            object: () => { return Object.assign({}, this.componentsMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }
    CreateComponent(root) {
        let existing = this.InferComponentFrom(root);
        if (existing) {
            return existing;
        }
        let component = new BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        this.componentsMonitorList_.forEach(monitor => JournalTry(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'components',
            object: () => { return Object.assign({}, this.components_); },
        }), 'InlineJS.Global.ChangesMonitor::components'));
        return component;
    }
    RemoveComponent(component) {
        let key = ((typeof component === 'string') ? component : component.GetId());
        if (this.components_.hasOwnProperty(key)) {
            let component = this.components_[key];
            delete this.components_[key];
            this.componentsMonitorList_.slice(0).forEach(monitor => JournalTry(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                target: 'components',
                object: () => { return Object.assign({}, this.components_); },
            }), 'InlineJS.Global.ChangesMonitor::components'));
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
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'current-component',
            object: () => this.currentComponent_,
        }), 'InlineJS.Global.ChangesMonitor::current-component'));
    }
    PopCurrentComponent() {
        let isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
        !isEmpty && this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'current-component',
            object: () => this.currentComponent_,
        }), 'InlineJS.Global.ChangesMonitor::current-component'));
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
    GetDirectiveManager() {
        return this.managers_.directive;
    }
    GetMagicManager() {
        return this.managers_.magic;
    }
    AddAttributeProcessor(processor) {
        this.attributeProcessors_.push(processor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'attribute-processors',
            object: () => { return [...this.attributeProcessors_]; },
        }), 'InlineJS.Global.ChangesMonitor::attribute-processors'));
    }
    DispatchAttributeProcessing(params) {
        this.attributeProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'text-content-processors',
            object: () => { return [...this.textContentProcessors_]; },
        }), 'InlineJS.Global.ChangesMonitor::text-content-processors'));
    }
    DispatchTextContentProcessing(params) {
        this.textContentProcessors_.forEach(processor => JournalTry(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }
    GetMutationObserver() {
        return this.mutationObserver_;
    }
    SetFetchConcept(concept) {
        this.fetchConcept_ = concept;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'fetch-concept',
            object: () => this.fetchConcept_,
        }), 'InlineJS.Global.ChangesMonitor::fetch-concept'));
    }
    GetFetchConcept() {
        return (this.fetchConcept_ || this.nativeFetch_);
    }
    SetConcept(name, concept) {
        this.concepts_[name] = concept;
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'concepts',
            object: () => { return Object.assign({}, this.concepts_); },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
    }
    RemoveConcept(name) {
        delete this.concepts_[name];
        this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
            target: 'concepts',
            object: () => { return Object.assign({}, this.concepts_); },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
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
    RetrieveObject_({ key, componentId, contextElement }, remove) {
        if (contextElement) {
            let component = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement));
            if (component) {
                let found = component.FindElementLocal(contextElement, key, true);
                if (found) {
                    let value = found.GetLocal(key);
                    remove && found.DeleteLocal(key);
                    return value;
                }
            }
        }
        if (this.storedObjects_.hasOwnProperty(key)) {
            let value = this.storedObjects_[key];
            if (remove) {
                delete this.storedObjects_[key];
                this.changesMonitorList_.forEach(monitor => JournalTry(() => monitor({
                    target: 'stored-objects',
                    object: () => { return Object.assign({}, this.storedObjects_); },
                }), 'InlineJS.Global.ChangesMonitor::stored-objects'));
            }
            return value;
        }
        return this.CreateNothing();
    }
}
