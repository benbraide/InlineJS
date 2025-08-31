"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElementScope = void 0;
const manager_1 = require("../directive/manager");
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const changes_monitor_1 = require("./changes-monitor");
const element_scope_id_1 = require("./element-scope-id");
const event_1 = require("./event");
const cache_1 = require("./cache");
const find_1 = require("./find");
const get_attribute_1 = require("../utilities/get-attribute");
const get_config_1 = require("./get-config");
const create_1 = require("../directive/create");
const dispatch_1 = require("../directive/dispatch");
const template_1 = require("../utilities/template");
const is_custom_element_1 = require("../utilities/is-custom-element");
class ElementScope extends changes_monitor_1.ChangesMonitor {
    constructor(componentId_, id_, element_, isRoot_, component, callback) {
        super();
        this.componentId_ = componentId_;
        this.id_ = id_;
        this.element_ = element_;
        this.isRoot_ = isRoot_;
        this.isInitialized_ = false;
        this.key_ = '';
        this.locals_ = {};
        this.data_ = {};
        this.queuedAttributeChanges_ = null;
        this.managers_ = {
            directive: null,
        };
        this.callbacks_ = {
            post: new Array(),
            postAttributes: new Array(),
            uninit: new Array(),
            marked: new Array(),
            treeChange: new Array(),
            attributeChange: new Array(),
        };
        this.state_ = {
            isMarked: false,
            isDestroyed: false,
        };
        element_[element_scope_id_1.ElementScopeKey] = id_;
        callback === null || callback === void 0 ? void 0 : callback(this);
        const processDirective = (names) => {
            const info = (0, get_attribute_1.FindFirstAttribute)(element_, names);
            if (info) {
                const directive = (0, create_1.CreateDirective)(info.name, info.value);
                directive && (0, dispatch_1.DispatchDirective)(component || componentId_, element_, directive);
            }
        };
        const config = (0, get_config_1.GetConfig)();
        const knownDirectives = ['data', 'component', 'ref', 'locals', 'init'].map(name => [config.GetDirectiveName(name, false), config.GetDirectiveName(name, true)]);
        knownDirectives.forEach(processDirective);
        this.isInitialized_ = true;
        if ((0, is_custom_element_1.IsCustomElement)(element_)) {
            (0, try_1.JournalTry)(() => element_.OnElementScopeCreated({
                componentId: componentId_,
                component: component || null,
                scope: this,
            }));
        }
    }
    SetInitialized() {
        this.isInitialized_ = true;
    }
    IsInitialized() {
        return this.isInitialized_;
    }
    GetComponentId() {
        return this.componentId_;
    }
    GetId() {
        return this.id_;
    }
    SetKey(key) {
        this.NotifyListeners_('key', (this.key_ = key));
    }
    GetKey() {
        return this.key_;
    }
    GetElement() {
        return this.element_;
    }
    IsRoot() {
        return this.isRoot_;
    }
    SetLocal(key, value) {
        if (!this.state_.isMarked) {
            this.locals_[key] = value;
            this.NotifyListeners_('locals', this.locals_);
        }
    }
    DeleteLocal(key) {
        delete this.locals_[key];
        this.NotifyListeners_('locals', this.locals_);
    }
    HasLocal(key) {
        return (key in this.locals_);
    }
    GetLocal(key) {
        return ((key in this.locals_) ? this.locals_[key] : (0, get_1.GetGlobal)().CreateNothing());
    }
    GetLocals() {
        return this.locals_;
    }
    SetData(key, value) {
        if (!this.state_.isMarked) {
            this.data_[key] = value;
            this.NotifyListeners_('data', this.data_);
        }
    }
    GetData(key) {
        return ((key in this.data_) ? this.data_[key] : (0, get_1.GetGlobal)().CreateNothing());
    }
    AddPostProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.post.push(callback);
            this.NotifyListeners_('post-process-callbacks', this.callbacks_.post);
        }
    }
    ExecutePostProcessCallbacks() {
        (this.callbacks_.post || []).splice(0).forEach(callback => (0, try_1.JournalTry)(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }
    AddPostAttributesProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.postAttributes.push(callback);
            this.NotifyListeners_('post-attributes-process-callbacks', this.callbacks_.postAttributes);
        }
    }
    ExecutePostAttributesProcessCallbacks() {
        (this.callbacks_.postAttributes || []).splice(0).forEach(callback => (0, try_1.JournalTry)(callback, 'ElementScope.ExecutePostAttributesProcessCallbacks'));
    }
    AddUninitCallback(callback) {
        if (!this.state_.isDestroyed) {
            this.callbacks_.uninit.push(callback);
            this.NotifyListeners_('uninit-callbacks', this.callbacks_.uninit);
        }
        else {
            (0, try_1.JournalTry)(callback);
        }
    }
    RemoveUninitCallback(callback) {
        this.callbacks_.uninit = this.callbacks_.uninit.filter(c => (c !== callback));
        this.NotifyListeners_('uninit-callbacks', this.callbacks_.uninit);
    }
    AddMarkedCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.marked.push(callback);
            this.NotifyListeners_('marked-callbacks', this.callbacks_.marked);
        }
        else {
            (0, try_1.JournalTry)(callback);
        }
    }
    RemoveMarkedCallback(callback) {
        this.callbacks_.marked = this.callbacks_.marked.filter(c => (c !== callback));
        this.NotifyListeners_('marked-callbacks', this.callbacks_.marked);
    }
    AddTreeChangeCallback(callback) {
        this.callbacks_.treeChange.push(callback);
        this.NotifyListeners_('tree-change-callbacks', this.callbacks_.treeChange);
    }
    RemoveTreeChangeCallback(callback) {
        this.callbacks_.treeChange = this.callbacks_.treeChange.filter(c => (c !== callback));
        this.NotifyListeners_('tree-change-callbacks', this.callbacks_.treeChange);
    }
    ExecuteTreeChangeCallbacks(added, removed) {
        this.callbacks_.treeChange.forEach(callback => (0, try_1.JournalTry)(() => callback({ added, removed })));
    }
    AddAttributeChangeCallback(callback, whitelist) {
        if (this.state_.isMarked) {
            return;
        }
        const existing = this.callbacks_.attributeChange.find(info => (info.callback === callback));
        if (!existing) {
            this.callbacks_.attributeChange.push({
                callback: callback,
                whitelist: ((typeof whitelist === 'string') ? [whitelist] : (whitelist || [])),
            });
        }
        else { //Add whitelist to existing
            existing.whitelist.push(...((typeof whitelist === 'string') ? [whitelist] : (whitelist || [])));
        }
        this.NotifyListeners_('attribute-change-callbacks', this.callbacks_.attributeChange);
    }
    RemoveAttributeChangeCallback(callback, whitelist) {
        const index = this.callbacks_.attributeChange.findIndex(info => (info.callback === callback));
        if (index == -1) {
            return;
        }
        const computedWhitelist = ((typeof whitelist === 'string') ? [whitelist] : (whitelist || []));
        if (computedWhitelist.length != 0 && this.callbacks_.attributeChange[index].whitelist.length != 0) {
            computedWhitelist.forEach((item) => {
                this.callbacks_.attributeChange[index].whitelist = this.callbacks_.attributeChange[index].whitelist.filter(eItem => (eItem !== item));
            });
        }
        else { //Clear whitelist
            this.callbacks_.attributeChange[index].whitelist.splice(0);
        }
        if (this.callbacks_.attributeChange[index].whitelist.length == 0) {
            this.callbacks_.attributeChange.splice(index, 1);
        }
        this.NotifyListeners_('attribute-change-callbacks', this.callbacks_.attributeChange);
    }
    ExecuteAttributeChangeCallbacks(name) {
        if (!this.queuedAttributeChanges_) {
            this.queuedAttributeChanges_ = [name];
            queueMicrotask(() => {
                if (!this.queuedAttributeChanges_) {
                    return;
                }
                const queue = this.queuedAttributeChanges_;
                this.queuedAttributeChanges_ = null;
                queue.forEach((name) => {
                    (this.callbacks_.attributeChange || []).filter(info => ((info.whitelist || []).length == 0 || info.whitelist.includes(name)))
                        .forEach(info => (0, try_1.JournalTry)(() => info.callback(name)));
                });
            });
        }
        else {
            !this.queuedAttributeChanges_.includes(name) && this.queuedAttributeChanges_.push(name);
        }
    }
    Destroy(markOnly) {
        if (this.state_.isDestroyed)
            return;
        const isCustomElement = (0, is_custom_element_1.IsCustomElement)(this.element_);
        const isTemplate = (0, template_1.IsTemplate)(this.element_);
        if (!this.state_.isMarked) {
            this.state_.isMarked = true;
            this.callbacks_.marked.splice(0).forEach(callback => (0, try_1.JournalTry)(callback));
            if (isCustomElement) {
                (0, try_1.JournalTry)(() => this.element_.OnElementScopeMarked(this));
            }
            if (markOnly && !isTemplate) {
                const component = (0, find_1.FindComponentById)(this.componentId_);
                component && this.DestroyChildren_(component, this.element_, true);
            }
        }
        if (markOnly)
            return;
        this.state_.isDestroyed = true;
        this.queuedAttributeChanges_ = null;
        this.callbacks_.uninit.splice(0).forEach(callback => (0, try_1.JournalTry)(callback));
        if (isCustomElement) {
            (0, try_1.JournalTry)(() => this.element_.OnElementScopeDestroyed(this));
        }
        if (!isTemplate) {
            const component = (0, find_1.FindComponentById)(this.componentId_);
            component && this.DestroyChildren_(component, this.element_, false);
        }
        this.callbacks_.post.splice(0);
        this.callbacks_.treeChange.splice(0);
        this.callbacks_.attributeChange.splice(0);
        this.data_ = {};
        this.locals_ = {};
        (0, event_1.UnbindOutsideEvent)(this.element_);
        (0, get_1.GetGlobal)().GetMutationObserver().Unobserve(this.element_);
        const component = (0, find_1.FindComponentById)(this.componentId_);
        component === null || component === void 0 ? void 0 : component.RemoveElementScope(this.id_); //Remove from component
        delete this.element_[element_scope_id_1.ElementScopeKey]; //Remove id value on element
        if (this.isRoot_) { //Remove component -- wait for changes to finalize
            const componentId = this.componentId_;
            component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddNextTickHandler(() => {
                (0, get_1.GetGlobal)().RemoveComponent(componentId);
                (0, cache_1.InvalidateComponentCache)(componentId);
            });
        }
    }
    IsMarked() {
        return this.state_.isMarked;
    }
    IsDestroyed() {
        return this.state_.isDestroyed;
    }
    GetDirectiveManager() {
        return (this.managers_.directive = (this.managers_.directive || new manager_1.DirectiveManager()));
    }
    DestroyChildren_(component, target, markOnly) {
        Array.from(target.children).filter(child => !child.contains(target)).forEach((child) => {
            const childScope = component.FindElementScope(child);
            if (childScope) { //Destroy element scope
                childScope.Destroy(markOnly);
            }
            else { //No element scope -- destroy children
                this.DestroyChildren_(component, child, markOnly);
            }
        });
    }
}
exports.ElementScope = ElementScope;
