import { GetGlobal } from "../global/get";
import { EvaluateMagicProperty } from "../magic/evaluate";
import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
import { ContextKeys } from "../utilities/context-keys";
import { DeleteProxyProp } from "./delete-prop";
import { GetProxyProp } from "./get-prop";
import { SetProxyProp } from "./set-prop";

export class GenericProxy implements IProxy{
    private parentPath_: string;
    protected native_: any = null;
    protected children_: Record<string, IProxy> = {};
    
    public constructor(protected componentId_: string, protected target_: any, private name_: string, parent?: IProxy){
        this.parentPath_ = (parent?.GetPath() || '');
        parent?.AddChild(this);
        
        let componentId = this.componentId_, path = this.GetPath(), noResultHandler = (component?: IComponent, prop?: string): any => {
            let { context } = component?.GetBackend()!, isMagic = prop?.startsWith('$');
            if (isMagic){
                let value = context.Peek(prop!.substring(1), GetGlobal().CreateNothing());
                if (!GetGlobal().IsNothing(value)){
                    return value;
                }
            }

            let contextElement = context.Peek(ContextKeys.self), localValue = component?.FindElementLocalValue((contextElement || component.GetRoot()), prop!, true);
            if (!GetGlobal().IsNothing(localValue)){
                return localValue;
            }
            
            let result = (isMagic ? EvaluateMagicProperty(component!, contextElement, prop!, '$') : GetGlobal().CreateNothing());
            if (GetGlobal().IsNothing(result) && prop && prop in globalThis){
                result = globalThis[prop];
            }

            return result;
        };
        
        let isRoot = !this.parentPath_, handler = {
            get(target: object, prop: string | number | symbol){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.get(target, prop);
                }

                return GetProxyProp(componentId, target, path, prop.toString(), (isRoot ? noResultHandler : undefined));
            },
            set(target: object, prop: string | number | symbol, value: any){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.set(target, prop, value);
                }

                return SetProxyProp(componentId, target, path, prop.toString(), value);
            },
            deleteProperty(target: object, prop: string | number | symbol){
                if (typeof prop === 'symbol' || prop === 'prototype'){
                    return Reflect.get(target, prop);
                }

                return DeleteProxyProp(componentId, target, path, prop.toString());
            },
            has(target: object, prop: string | number | symbol){
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
