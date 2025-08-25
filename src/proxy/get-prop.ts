import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { ProxyKeys } from "../utilities/proxy-keys";
import { IProxy } from "../types/proxy";
import { CreateChildProxy } from "./create-child";

export function GetProxyProp(componentId: string, proxy: IProxy, target: any, path: string, prop: string, noResultHandler?: (component?: IComponent, prop?: string) => any){
    switch (prop){
        case ProxyKeys.target:
            return target;
        case ProxyKeys.componentId:
            return componentId;
        case ProxyKeys.name:
            return path.split('.').at(-1);
        case ProxyKeys.path:
            return path;
        case ProxyKeys.parentPath:
            return path.split('.').slice(0, -1).join('.') || '';
        default:
            break;
    }

    if (prop in target){ //Property exists on target or its prototype
        if (!target.hasOwnProperty(prop)){//Prop is inherited
            return target[prop]; //Return raw inherited value, do not track or proxy
        }

        //Property is on the instance
        const value = target[prop];
        if (GetGlobal().IsFuture(value)){//No proxy representation
            return value.Get();
        }

        GetGlobal().GetCurrentProxyAccessStorage()?.Put(componentId, `${path}.${prop}`);//Alert GET access

        if (typeof value === 'function'){
            return value.bind(proxy.GetNative());
        }

        const component = FindComponentById(componentId);
        if (!component){
            return value;
        }

        return CreateChildProxy((component.FindProxy(path) || null), prop, value, component)?.GetNative() || value;
    }

    if (noResultHandler){ //Property does not exist on target, try noResultHandler (for hx-locals, magic, etc.)
        const value = noResultHandler((FindComponentById(componentId) || undefined), prop);
        if (!GetGlobal().IsNothing(value)){//Return raw value, do not track or proxy
            return GetGlobal().IsFuture(value) ? value.Get() : value;
        }
    }

    
    //Property not found anywhere, track access and return null as per design
    GetGlobal().GetCurrentProxyAccessStorage()?.Put(componentId, `${path}.${prop}`);//Alert GET access

    return null;
}
