"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGlobal = void 0;
const base_1 = require("../component/base");
const manager_1 = require("../directive/manager");
const try_1 = require("../journal/try");
const manager_2 = require("../magic/manager");
const mutation_1 = require("../observers/mutation");
const child_1 = require("../proxy/child");
const stack_1 = require("../stack");
const random_string_1 = require("../utilities/random-string");
const unique_markers_1 = require("../utilities/unique-markers");
const future_1 = require("../values/future");
const nothing_1 = require("../values/nothing");
const config_1 = require("./config");
const native_fetch_1 = require("./native-fetch");
class BaseGlobal {
    constructor(configOptions, idOffset = 0) {
        this.nothing_ = new nothing_1.Nothing;
        this.storedObjects_ = {};
        this.changesMonitorList_ = new Array();
        this.componentsMonitorList_ = new Array();
        this.components_ = {};
        this.currentComponent_ = new stack_1.Stack();
        this.attributeProcessors_ = new Array();
        this.textContentProcessors_ = new Array();
        this.managers_ = {
            directive: new manager_1.DirectiveManager(),
            magic: new manager_2.MagicManager(),
        };
        this.uniqueMarkers_ = (0, unique_markers_1.GetDefaultUniqueMarkers)();
        this.mutationObserver_ = new mutation_1.MutationObserver();
        this.nativeFetch_ = new native_fetch_1.NativeFetchConcept();
        this.fetchConcept_ = null;
        this.concepts_ = {};
        this.config_ = new config_1.Config(configOptions || {});
        this.uniqueMarkers_.level0 = (idOffset || 0);
    }
    SwapConfig(config) {
        this.config_ = config;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'config',
            object: () => config,
        }), 'InlineJS.Global.ChangesMonitor::config'));
    }
    GetConfig() {
        return this.config_;
    }
    GenerateUniqueId(prefix, suffix) {
        const generated = (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_, '', prefix, suffix);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'markers',
            object: () => { return Object.assign({}, this.uniqueMarkers_); },
        }), 'InlineJS.Global.ChangesMonitor::markers'));
        return generated;
    }
    StoreObject({ object, componentId, contextElement }) {
        var _a;
        const key = `@!@${(0, random_string_1.RandomString)(18)}@!@`;
        if (contextElement) {
            let scope = (_a = (this.FindComponentById(componentId || '') || this.InferComponentFrom(contextElement))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
            if (scope) {
                scope.SetLocal(key, object);
                return key;
            }
        }
        this.storedObjects_[key] = object;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }
    RemoveChangesMonitor(monitor) {
        let len = this.changesMonitorList_.length;
        this.changesMonitorList_ = this.changesMonitorList_.filter(m => (m !== monitor));
        (len != this.changesMonitorList_.length) && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'changes-monitor',
            object: () => { return Object.assign({}, this.changesMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::changes-monitor'));
    }
    AddComponentMonitor(monitor) {
        this.componentsMonitorList_.push(monitor);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'components-monitor',
            object: () => { return Object.assign({}, this.componentsMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }
    RemoveComponentMonitor(monitor) {
        let len = this.componentsMonitorList_.length;
        this.componentsMonitorList_ = this.componentsMonitorList_.filter(m => (m !== monitor));
        (len != this.componentsMonitorList_.length) && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'components-monitor',
            object: () => { return Object.assign({}, this.componentsMonitorList_); },
        }), 'InlineJS.Global.ChangesMonitor::components-monitor'));
    }
    CreateComponent(root) {
        let existing = this.InferComponentFrom(root);
        if (existing) {
            return existing;
        }
        let component = new base_1.BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        this.componentsMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({ action: 'add', component }), 'InlineJS.Global.CreateComponent'));
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
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
            this.componentsMonitorList_.slice(0).forEach(monitor => (0, try_1.JournalTry)(() => monitor({ action: 'remove', component }), 'InlineJS.Global.RemoveComponent'));
            this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'current-component',
            object: () => this.currentComponent_,
        }), 'InlineJS.Global.ChangesMonitor::current-component'));
    }
    PopCurrentComponent() {
        let isEmpty = this.currentComponent_.IsEmpty(), popped = this.currentComponent_.Pop();
        !isEmpty && this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
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
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'attribute-processors',
            object: () => { return [...this.attributeProcessors_]; },
        }), 'InlineJS.Global.ChangesMonitor::attribute-processors'));
    }
    DispatchAttributeProcessing(params) {
        this.attributeProcessors_.forEach(processor => (0, try_1.JournalTry)(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'text-content-processors',
            object: () => { return [...this.textContentProcessors_]; },
        }), 'InlineJS.Global.ChangesMonitor::text-content-processors'));
    }
    DispatchTextContentProcessing(params) {
        this.textContentProcessors_.forEach(processor => (0, try_1.JournalTry)(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
    }
    GetMutationObserver() {
        return this.mutationObserver_;
    }
    SetFetchConcept(concept) {
        this.fetchConcept_ = concept;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'fetch-concept',
            object: () => this.fetchConcept_,
        }), 'InlineJS.Global.ChangesMonitor::fetch-concept'));
    }
    GetFetchConcept() {
        return (this.fetchConcept_ || this.nativeFetch_);
    }
    SetConcept(name, concept) {
        this.concepts_[name] = concept;
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'concepts',
            object: () => { return Object.assign({}, this.concepts_); },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
    }
    RemoveConcept(name) {
        delete this.concepts_[name];
        this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
            target: 'concepts',
            object: () => { return Object.assign({}, this.concepts_); },
        }), 'InlineJS.Global.ChangesMonitor::concepts'));
    }
    GetConcept(name) {
        return (this.concepts_.hasOwnProperty(name) ? this.concepts_[name] : null);
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
                this.changesMonitorList_.forEach(monitor => (0, try_1.JournalTry)(() => monitor({
                    target: 'stored-objects',
                    object: () => { return Object.assign({}, this.storedObjects_); },
                }), 'InlineJS.Global.ChangesMonitor::stored-objects'));
            }
            return value;
        }
        return this.CreateNothing();
    }
}
exports.BaseGlobal = BaseGlobal;
