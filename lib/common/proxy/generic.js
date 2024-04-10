"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericProxy = void 0;
const get_1 = require("../global/get");
const try_1 = require("../journal/try");
const evaluate_1 = require("../magic/evaluate");
const context_keys_1 = require("../utilities/context-keys");
const delete_prop_1 = require("./delete-prop");
const get_prop_1 = require("./get-prop");
const set_prop_1 = require("./set-prop");
class GenericProxy {
    constructor(componentId_, target_, name_, parent, scopeId = null) {
        this.componentId_ = componentId_;
        this.target_ = target_;
        this.name_ = name_;
        this.native_ = null;
        this.children_ = {};
        this.parentPath_ = ((parent === null || parent === void 0 ? void 0 : parent.GetPath()) || '');
        parent === null || parent === void 0 ? void 0 : parent.AddChild(this);
        const componentId = this.componentId_, isFalseRoot = !!scopeId, path = this.GetPath(), noResultHandler = (component, prop) => {
            const { context } = component === null || component === void 0 ? void 0 : component.GetBackend(), isMagic = prop === null || prop === void 0 ? void 0 : prop.startsWith('$');
            if (isMagic) {
                const value = context.Peek(prop.substring(1), (0, get_1.GetGlobal)().CreateNothing());
                if (!(0, get_1.GetGlobal)().IsNothing(value)) {
                    return value;
                }
            }
            const contextElement = context.Peek(context_keys_1.ContextKeys.self), localValue = component === null || component === void 0 ? void 0 : component.FindElementLocalValue((contextElement || component.GetRoot()), prop, true);
            if (!(0, get_1.GetGlobal)().IsNothing(localValue)) {
                return localValue;
            }
            const result = (isMagic ? (0, evaluate_1.EvaluateMagicProperty)(component, contextElement, prop, '$') : (0, get_1.GetGlobal)().CreateNothing());
            return ((prop && (0, get_1.GetGlobal)().IsNothing(result) && (0, get_1.GetGlobal)().GetConfig().GetUseGlobalWindow() && (prop in globalThis)) ? globalThis[prop] : result);
        };
        const isRoot = (!isFalseRoot && !this.parentPath_), handler = {
            get(target, prop) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = (0, get_1.GetGlobal)().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Get) ? handler.Get(prop, target) : (0, get_1.GetGlobal)().CreateNothing());
                    if (!(0, get_1.GetGlobal)().IsNothing(result)) {
                        return result;
                    }
                }
                if ((isRoot || isFalseRoot) && target.hasOwnProperty(prop) && typeof target[prop] === 'function' && (0, get_1.GetGlobal)().GetConfig().GetWrapScopedFunctions()) {
                    const component = (0, get_1.GetGlobal)().FindComponentById(componentId), scope = component === null || component === void 0 ? void 0 : component.FindScopeById(scopeId || ''), fn = target[prop];
                    scope && (0, get_1.GetGlobal)().PushScopeContext(scope);
                    const result = (0, try_1.JournalTry)(() => ((...args) => fn(...args)));
                    scope && (0, get_1.GetGlobal)().PopScopeContext();
                    return result;
                }
                return (0, get_prop_1.GetProxyProp)(componentId, target, path, prop.toString(), (isRoot ? noResultHandler : undefined));
            },
            set(target, prop, value) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.set(target, prop, value);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = (0, get_1.GetGlobal)().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Set) ? handler.Set(prop, value, target) : (0, get_1.GetGlobal)().CreateNothing());
                    if (!(0, get_1.GetGlobal)().IsNothing(result)) {
                        return result;
                    }
                }
                return (0, set_prop_1.SetProxyProp)(componentId, target, path, prop.toString(), value);
            },
            deleteProperty(target, prop) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = (0, get_1.GetGlobal)().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Delete) ? handler.Delete(prop, target) : (0, get_1.GetGlobal)().CreateNothing());
                    if (!(0, get_1.GetGlobal)().IsNothing(result)) {
                        return result;
                    }
                }
                return (0, delete_prop_1.DeleteProxyProp)(componentId, target, path, prop.toString());
            },
            has(target, prop) {
                var _a;
                if (isRoot && typeof prop !== 'symbol') { //Check for handler
                    const handler = (_a = (0, get_1.GetGlobal)().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Has) ? handler.Has(prop, target) : (0, get_1.GetGlobal)().CreateNothing());
                    if (!(0, get_1.GetGlobal)().IsNothing(result)) {
                        return result;
                    }
                }
                return (typeof prop !== 'symbol' || Reflect.has(target, prop));
            },
        };
        this.native_ = new window.Proxy(this.target_, handler);
    }
    IsRoot() {
        return !this.parentPath_;
    }
    GetComponentId() {
        return this.componentId_;
    }
    GetTarget() {
        return this.target_;
    }
    GetNative() {
        return this.native_;
    }
    GetName() {
        return this.name_;
    }
    GetPath() {
        return (this.parentPath_ ? `${this.parentPath_}.${this.name_}` : this.name_);
    }
    GetParentPath() {
        return this.parentPath_;
    }
    AddChild(child) {
        this.children_[child.GetName()] = child;
    }
    RemoveChild(child) {
        delete this.children_[((typeof child === 'string') ? child : child.GetName())];
    }
    FindChild(name) {
        return (this.children_.hasOwnProperty(name) ? this.children_[name] : null);
    }
}
exports.GenericProxy = GenericProxy;
