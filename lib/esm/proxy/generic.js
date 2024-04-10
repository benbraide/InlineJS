import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { EvaluateMagicProperty } from "../magic/evaluate";
import { ContextKeys } from "../utilities/context-keys";
import { DeleteProxyProp } from "./delete-prop";
import { GetProxyProp } from "./get-prop";
import { SetProxyProp } from "./set-prop";
export class GenericProxy {
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
                const value = context.Peek(prop.substring(1), GetGlobal().CreateNothing());
                if (!GetGlobal().IsNothing(value)) {
                    return value;
                }
            }
            const contextElement = context.Peek(ContextKeys.self), localValue = component === null || component === void 0 ? void 0 : component.FindElementLocalValue((contextElement || component.GetRoot()), prop, true);
            if (!GetGlobal().IsNothing(localValue)) {
                return localValue;
            }
            const result = (isMagic ? EvaluateMagicProperty(component, contextElement, prop, '$') : GetGlobal().CreateNothing());
            return ((prop && GetGlobal().IsNothing(result) && GetGlobal().GetConfig().GetUseGlobalWindow() && (prop in globalThis)) ? globalThis[prop] : result);
        };
        const isRoot = (!isFalseRoot && !this.parentPath_), handler = {
            get(target, prop) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = GetGlobal().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Get) ? handler.Get(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)) {
                        return result;
                    }
                }
                if ((isRoot || isFalseRoot) && target.hasOwnProperty(prop) && typeof target[prop] === 'function' && GetGlobal().GetConfig().GetWrapScopedFunctions()) {
                    const component = GetGlobal().FindComponentById(componentId), scope = component === null || component === void 0 ? void 0 : component.FindScopeById(scopeId || ''), fn = target[prop];
                    scope && GetGlobal().PushScopeContext(scope);
                    const result = JournalTry(() => ((...args) => fn(...args)));
                    scope && GetGlobal().PopScopeContext();
                    return result;
                }
                return GetProxyProp(componentId, target, path, prop.toString(), (isRoot ? noResultHandler : undefined));
            },
            set(target, prop, value) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.set(target, prop, value);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = GetGlobal().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Set) ? handler.Set(prop, value, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)) {
                        return result;
                    }
                }
                return SetProxyProp(componentId, target, path, prop.toString(), value);
            },
            deleteProperty(target, prop) {
                var _a;
                if (typeof prop === 'symbol' || prop === 'prototype') {
                    return Reflect.get(target, prop);
                }
                if (isRoot) { //Check for handler
                    const handler = (_a = GetGlobal().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Delete) ? handler.Delete(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)) {
                        return result;
                    }
                }
                return DeleteProxyProp(componentId, target, path, prop.toString());
            },
            has(target, prop) {
                var _a;
                if (isRoot && typeof prop !== 'symbol') { //Check for handler
                    const handler = (_a = GetGlobal().FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
                    const result = ((handler && handler.Has) ? handler.Has(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)) {
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
