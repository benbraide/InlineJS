import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";

export type ProxyLookupType = Array<string> | ((prop: string, target?: any) => boolean);

export interface IProxyAlertOptions{
    componentId: string;
    id: string;
    list?: Array<string>;
}

export interface IProxyOptions{
    target?: Record<string, any> | Array<any>;
    getter?: (prop?: string, target?: any) => any;
    setter?: (prop?: string, value?: any, target?: any) => boolean;
    deleter?: (prop?: string, target?: any) => boolean;
    lookup?: ProxyLookupType;
    alert?: IProxyAlertOptions;
}

export function CreateInplaceProxy({ target, getter, setter, deleter, lookup, alert }: IProxyOptions){
    const handler = {
        get(target: object, prop: string | number | symbol): any{
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')){
                return Reflect.get(target, prop);
            }

            const value = (getter ? getter(prop.toString(), target) : target[prop]);
            if (!GetGlobal().IsNothing(value)){
                if (alert && (!alert.list || prop in alert.list)){
                    FindComponentById(alert.componentId)?.GetBackend().changes.AddGetAccess(`${alert.id}.${prop}`);
                }
                return value;
            }

            return Reflect.get(target, prop);
        },
        set(target: object, prop: string | number | symbol, value: any){
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')){
                return Reflect.set(target, prop, value);
            }

            return (setter ? (setter(prop.toString(), value, target) !== false) : (!!target[prop] || true));
        },
        deleteProperty(target: object, prop: string | number | symbol){
            if (typeof prop === 'symbol' || (typeof prop === 'string' && prop === 'prototype')){
                return Reflect.deleteProperty(target, prop);
            }

            return (deleter ? (deleter(prop.toString(), target) !== false) : (!!(delete target[prop]) || true));
        },
        has(target: object, prop: string | number | symbol){
            if (Reflect.has(target, prop)){
                return true;
            }

            if (Array.isArray(lookup)){
                return lookup.includes(prop.toString());
            }

            return (lookup ? lookup(prop.toString(), target) : (prop in target));
        }
    };

    return new window.Proxy((target || {}), handler);
}

export function CreateReadonlyProxy(target: Array<any> | Record<string, any>){
    return CreateInplaceProxy(BuildGetterProxyOptions({ getter: prop => ((prop && prop in target && target[prop]) || null), lookup: [...Object.keys(target)]}));
}

export function DisableProxyAction(){
    return false;
}

export function BuildProxyOptions({ setter, deleter, lookup, ...rest }: IProxyOptions): IProxyOptions{
    return { ...rest,
        setter: (setter || DisableProxyAction),
        deleter: (deleter || DisableProxyAction),
        lookup: (lookup || DisableProxyAction),
    };
}

export interface IGetterProxyOptions{
    getter?: (prop?: string, target?: any) => any;
    lookup?: ProxyLookupType;
    alert?: IProxyAlertOptions;
}

export function BuildGetterProxyOptions(options: IGetterProxyOptions){
    return BuildProxyOptions(options);
}
