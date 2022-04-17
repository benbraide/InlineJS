import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
import { IsObject } from "../utilities/is-object";

export function CreateChildProxy(owner: IProxy | null, name: string, target: any, component?: IComponent): IProxy | null{
    if (!owner){
        return null;
    }

    let child = owner.FindChild(name);
    if (child){
        return child;
    }

    if ((!Array.isArray(target) && !IsObject(target))){
        return null;
    }

    let proxy = GetGlobal().CreateChildProxy(owner, name, target);
    if (component){//Register to component
        component.AddProxy(proxy);
    }

    return proxy;
}
