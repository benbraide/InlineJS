import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { EvaluateMagicProperty } from "../magic/evaluate";
import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
import { ContextKeys } from "../utilities/context-keys";
import { Nothing } from "../values/nothing";
import { DeleteProxyProp } from "./delete-prop";
import { GetProxyProp } from "./get-prop";
import { SetProxyProp } from "./set-prop";

export class GenericProxy implements IProxy{
    private parentPath_: string;
    protected native_: any = null;
    protected children_: Record<string, IProxy> = {};
    
    public constructor(protected componentId_: string, protected target_: any, private name_: string, parent?: IProxy, scopeId: string | null = null){
        this.parentPath_ = (parent?.GetPath() || '');
        parent?.AddChild(this);
        
        const componentId = this.componentId_, isFalseRoot = !!scopeId, path = this.GetPath(), noResultHandler = (component?: IComponent, prop?: string): any => {
            const { context } = component?.GetBackend()!, isMagic = prop?.startsWith('$');
            if (isMagic){
                const value = context.Peek(prop!.substring(1), GetGlobal().CreateNothing());
                if (!GetGlobal().IsNothing(value)){
                    return value;
                }
            }

            const contextElement = context.Peek(ContextKeys.self), localValue = component?.FindElementLocalValue((contextElement || component.GetRoot()), prop!, true);
            if (!GetGlobal().IsNothing(localValue)){
                return localValue;
            }
            
            const result = (isMagic ? EvaluateMagicProperty(component!, contextElement, prop!, '$') : GetGlobal().CreateNothing());
            return ((prop && GetGlobal().IsNothing(result) && GetGlobal().GetConfig().GetUseGlobalWindow() && (prop in globalThis)) ? globalThis[prop] : result);
        };
        
        const isRoot = (!isFalseRoot && !this.parentPath_), handler = {
            get(target: object, prop: string | number | symbol){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.get(target, prop);
                }

                if (isRoot){//Check for handler
                    const handler = GetGlobal().FindComponentById(componentId)?.GetProxyAccessHandler();
                    const result = ((handler && handler.Get) ? handler.Get(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)){
                        return result;
                    }
                }

                if ((isRoot || isFalseRoot) && target.hasOwnProperty(prop) && typeof target[prop] === 'function' && GetGlobal().GetConfig().GetWrapScopedFunctions()){
                    const component = GetGlobal().FindComponentById(componentId), scope = component?.FindScopeById(scopeId || ''), fn = target[prop];

                    scope && GetGlobal().PushScopeContext(scope);
                    const result = JournalTry(() => ((...args: any[]) => fn(...args)));
                    scope && GetGlobal().PopScopeContext();

                    return result;
                }

                return GetProxyProp(componentId, target, path, prop.toString(), (isRoot ? noResultHandler : undefined));
            },
            set(target: object, prop: string | number | symbol, value: any){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.set(target, prop, value);
                }

                if (isRoot){//Check for handler
                    const handler = GetGlobal().FindComponentById(componentId)?.GetProxyAccessHandler();
                    const result = ((handler && handler.Set) ? handler.Set(prop, value, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)){
                        return result;
                    }
                }

                return SetProxyProp(componentId, target, path, prop.toString(), value);
            },
            deleteProperty(target: object, prop: string | number | symbol){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.get(target, prop);
                }

                if (isRoot){//Check for handler
                    const handler = GetGlobal().FindComponentById(componentId)?.GetProxyAccessHandler();
                    const result = ((handler && handler.Delete) ? handler.Delete(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)){
                        return result;
                    }
                }

                return DeleteProxyProp(componentId, target, path, prop.toString());
            },
            has(target: object, prop: string | number | symbol){
                if (isRoot && typeof prop !== 'symbol'){//Check for handler
                    const handler = GetGlobal().FindComponentById(componentId)?.GetProxyAccessHandler();
                    const result = ((handler && handler.Has) ? handler.Has(prop, target) : GetGlobal().CreateNothing());
                    if (!GetGlobal().IsNothing(result)){
                        return (result as any as boolean);
                    }
                }
                
                return (typeof prop !== 'symbol' || Reflect.has(target, prop));
            },
        };

        this.native_ = new window.Proxy(this.target_, handler);
    }
    
    public IsRoot(){
        return !this.parentPath_;
    }

    public GetComponentId(){
        return this.componentId_;
    }

    public GetTarget(){
        return this.target_;
    }

    public GetNative(){
        return this.native_;
    }

    public GetName(){
        return this.name_;
    }

    public GetPath(){
        return (this.parentPath_ ? `${this.parentPath_}.${this.name_}` : this.name_);
    }

    public GetParentPath(){
        return this.parentPath_;
    }
    
    public AddChild(child: IProxy){
        this.children_[child.GetName()] = child;
    }

    public RemoveChild(child: IProxy | string){
        delete this.children_[((typeof child === 'string') ? child : child.GetName())];
    }

    public FindChild(name: string){
        return (this.children_.hasOwnProperty(name) ? this.children_[name] : null);
    }
}
