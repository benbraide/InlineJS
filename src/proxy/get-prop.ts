import { FindComponentById } from "../component/find";
import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { ProxyKeys } from "../utilities/proxy-keys";
import { CreateChildProxy } from "./create-child";

export function GetProxyProp(componentId: string, target: any, path: string, prop: string, noResultHandler?: (component?: IComponent, prop?: string) => any){
    if (prop === ProxyKeys.target){
        return target;
    }
    
    if (prop === ProxyKeys.componentId){
        return componentId;
    }

    if (prop === ProxyKeys.name){
        return path.split('.').at(-1);
    }

    if (prop === ProxyKeys.path){
        return path;
    }

    if (prop === ProxyKeys.parentPath){
        return (path.split('.').slice(0, -1).join('.') || '');
    }

    let exists = (prop in target);
    if (!exists && noResultHandler){
        let value = noResultHandler((FindComponentById(componentId) || undefined), prop);
        if (!GetGlobal().IsNothing(value)){
            return (GetGlobal().IsFuture(value) ? value.Get() : value);
        }
    }

    if (exists && !target.hasOwnProperty(prop)){//Prop not in this instance
        return target[prop];
    }

    let value: any = (exists ? target[prop] : null);
    if (GetGlobal().IsFuture(value)){//No proxy representation
        return value.Get();
    }

    let component = FindComponentById(componentId);
    component?.GetBackend().changes.AddGetAccess(`${path}.${prop}`);//Alert GET access
    
    return (CreateChildProxy((component?.FindProxy(path) || null), prop, value, (component || undefined))?.GetNative() || value);
}
