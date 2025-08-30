import { DirectiveManager } from "../directive/manager";
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { ChangesMonitor } from "./changes-monitor";
import { ElementScopeKey } from "./element-scope-id";
import { UnbindOutsideEvent } from "./event";
import { InvalidateComponentCache } from "./cache";
import { FindComponentById } from "./find";
import { FindFirstAttribute } from "../utilities/get-attribute";
import { GetConfig } from "./get-config";
import { CreateDirective } from "../directive/create";
import { DispatchDirective } from "../directive/dispatch";
import { IsTemplate } from "../utilities/template";
import { IsCustomElement } from "../utilities/is-custom-element";
export class ElementScope extends ChangesMonitor {
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
        element_[ElementScopeKey] = id_;
        callback === null || callback === void 0 ? void 0 : callback(this);
        const processDirective = (names) => {
            const info = FindFirstAttribute(element_, names);
            if (info) {
                const directive = CreateDirective(info.name, info.value);
                directive && DispatchDirective(component || componentId_, element_, directive);
            }
        };
        const config = GetConfig();
        const knownDirectives = ['data', 'component', 'ref', 'locals', 'init'].map(name => [config.GetDirectiveName(name, false), config.GetDirectiveName(name, true)]);
        knownDirectives.forEach(processDirective);
        this.isInitialized_ = true;
        if (IsCustomElement(element_)) {
            JournalTry(() => element_.OnElementScopeCreated({
                componentId: this.id_,
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
        return ((key in this.locals_) ? this.locals_[key] : GetGlobal().CreateNothing());
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
        return ((key in this.data_) ? this.data_[key] : GetGlobal().CreateNothing());
    }
    AddPostProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.post.push(callback);
            this.NotifyListeners_('post-process-callbacks', this.callbacks_.post);
        }
    }
    ExecutePostProcessCallbacks() {
        (this.callbacks_.post || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostProcessCallbacks'));
    }
    AddPostAttributesProcessCallback(callback) {
        if (!this.state_.isMarked) {
            this.callbacks_.postAttributes.push(callback);
            this.NotifyListeners_('post-attributes-process-callbacks', this.callbacks_.postAttributes);
        }
    }
    ExecutePostAttributesProcessCallbacks() {
        (this.callbacks_.postAttributes || []).splice(0).forEach(callback => JournalTry(callback, 'ElementScope.ExecutePostAttributesProcessCallbacks'));
    }
    AddUninitCallback(callback) {
        if (!this.state_.isDestroyed) {
            this.callbacks_.uninit.push(callback);
            this.NotifyListeners_('uninit-callbacks', this.callbacks_.uninit);
        }
        else {
            JournalTry(callback);
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
            JournalTry(callback);
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
        this.callbacks_.treeChange.forEach(callback => JournalTry(() => callback({ added, removed })));
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
                        .forEach(info => JournalTry(() => info.callback(name)));
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
        const isCustomElement = IsCustomElement(this.element_);
        const isTemplate = IsTemplate(this.element_);
        if (!this.state_.isMarked) {
            this.state_.isMarked = true;
            this.callbacks_.marked.splice(0).forEach(callback => JournalTry(callback));
            if (isCustomElement) {
                JournalTry(() => this.element_.OnElementScopeMarked(this));
            }
            if (markOnly && !isTemplate) {
                const component = FindComponentById(this.componentId_);
                component && this.DestroyChildren_(component, this.element_, true);
            }
        }
        if (markOnly)
            return;
        this.state_.isDestroyed = true;
        this.queuedAttributeChanges_ = null;
        this.callbacks_.uninit.splice(0).forEach(callback => JournalTry(callback));
        if (isCustomElement) {
            JournalTry(() => this.element_.OnElementScopeDestroyed(this));
        }
        if (!isTemplate) {
            const component = FindComponentById(this.componentId_);
            component && this.DestroyChildren_(component, this.element_, false);
        }
        this.callbacks_.post.splice(0);
        this.callbacks_.treeChange.splice(0);
        this.callbacks_.attributeChange.splice(0);
        this.data_ = {};
        this.locals_ = {};
        UnbindOutsideEvent(this.element_);
        GetGlobal().GetMutationObserver().Unobserve(this.element_);
        const component = FindComponentById(this.componentId_);
        component === null || component === void 0 ? void 0 : component.RemoveElementScope(this.id_); //Remove from component
        delete this.element_[ElementScopeKey]; //Remove id value on element
        if (this.isRoot_) { //Remove component -- wait for changes to finalize
            const componentId = this.componentId_;
            component === null || component === void 0 ? void 0 : component.GetBackend().changes.AddNextTickHandler(() => {
                GetGlobal().RemoveComponent(componentId);
                InvalidateComponentCache(componentId);
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
        return (this.managers_.directive = (this.managers_.directive || new DirectiveManager()));
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
