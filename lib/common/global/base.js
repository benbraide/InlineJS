"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGlobal = void 0;
const base_1 = require("../component/base");
const element_scope_id_1 = require("../component/element-scope-id");
const manager_1 = require("../directive/manager");
const try_1 = require("../journal/try");
const manager_2 = require("../magic/manager");
const mutation_1 = require("../observers/mutation");
const child_1 = require("../proxy/child");
const stack_1 = require("../stack");
const unique_markers_1 = require("../utilities/unique-markers");
const future_1 = require("../values/future");
const nothing_1 = require("../values/nothing");
const config_1 = require("./config");
const native_fetch_1 = require("./native-fetch");
class BaseGlobal {
    constructor(configOptions, idOffset = 0) {
        this.nothing_ = new nothing_1.Nothing;
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
    }
    GetConfig() {
        return this.config_;
    }
    GenerateUniqueId(prefix, suffix) {
        return (0, unique_markers_1.GenerateUniqueId)(this.uniqueMarkers_, '', prefix, suffix);
    }
    CreateComponent(root) {
        let existing = Object.values(this.components_).find(component => (component.GetRoot() === root));
        if (existing) {
            return existing;
        }
        let component = new base_1.BaseComponent(this.GenerateUniqueId(), root);
        this.components_[component.GetId()] = component;
        return component;
    }
    RemoveComponent(component) {
        delete this.components_[((typeof component === 'string') ? component : component.GetId())];
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
        let scopeId = (0, element_scope_id_1.GetElementScopeId)(element);
        return ((scopeId && Object.values(this.components_).find(component => !!component.FindElementScope(scopeId))) || null);
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
        this.attributeProcessors_.forEach(processor => (0, try_1.JournalTry)(() => processor(params), 'InlineJS.Global.DispatchAttribute', params.contextElement));
    }
    AddTextContentProcessor(processor) {
        this.textContentProcessors_.push(processor);
    }
    DispatchTextContentProcessing(params) {
        this.textContentProcessors_.forEach(processor => (0, try_1.JournalTry)(() => processor(params), 'InlineJS.Global.DispatchTextContent', params.contextElement));
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
}
exports.BaseGlobal = BaseGlobal;
