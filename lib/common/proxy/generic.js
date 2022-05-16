"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericProxy = void 0;
const get_1 = require("../global/get");
const evaluate_1 = require("../magic/evaluate");
const context_keys_1 = require("../utilities/context-keys");
const delete_prop_1 = require("./delete-prop");
const get_prop_1 = require("./get-prop");
const set_prop_1 = require("./set-prop");
class GenericProxy {
    constructor(componentId_, target_, name_, parent) {
        this.componentId_ = componentId_;
        this.target_ = target_;
        this.name_ = name_;
        this.native_ = null;
        this.children_ = {};
        this.parentPath_ = ((parent === null || parent === void 0 ? void 0 : parent.GetPath()) || '');
        parent === null || parent === void 0 ? void 0 : parent.AddChild(this);
        let componentId = this.componentId_, path = this.GetPath(), noResultHandler = (component, prop) => {
            let { context } = component === null || component === void 0 ? void 0 : component.GetBackend(), isMagic = prop === null || prop === void 0 ? void 0 : prop.startsWith('$');
            if (isMagic) {
                let value = context.Peek(prop.substring(1), (0, get_1.GetGlobal)().CreateNothing());
                if (!(0, get_1.GetGlobal)().IsNothing(value)) {
                    return value;
                }
            }
            let contextElement = context.Peek(context_keys_1.ContextKeys.self), localValue = component === null || component === void 0 ? void 0 : component.FindElementLocalValue((contextElement || component.GetRoot()), prop, true);
            if (!(0, get_1.GetGlobal)().IsNothing(localValue)) {
                return localValue;
            }
            let result = (isMagic ? (0, evaluate_1.EvaluateMagicProperty)(component, contextElement, prop, '$') : (0, get_1.GetGlobal)().CreateNothing());
            if ((0, get_1.GetGlobal)().IsNothing(result) && prop && prop in globalThis) {
                result = globalThis[prop];
            }
            return result;
        };
        let isRoot = !this.parentPath_, handler = {
            get(target, prop) {
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                return (0, get_prop_1.GetProxyProp)(componentId, target, path, prop.toString(), (isRoot ? noResultHandler : undefined));
            },
            set(target, prop, value) {
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.set(target, prop, value);
                }
                return (0, set_prop_1.SetProxyProp)(componentId, target, path, prop.toString(), value);
            },
            deleteProperty(target, prop) {
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                return (0, delete_prop_1.DeleteProxyProp)(componentId, target, path, prop.toString());
            },
            has(target, prop) {
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
