import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { IProxy } from "../types/proxy";
import { IsObject } from "../utilities/is-object";
import { FindComponentById } from "../component/find";

export function CreateChildProxy(owner: IProxy | null, name: string, target: any, component?: IComponent): IProxy | null{
    if (!owner){
        return null;
    }

    const child = owner.FindChild(name);
    if (child){
        return child;
    }

    if ((!Array.isArray(target) && !IsObject(target))){
        return null;
    }

    const proxy = GetGlobal().CreateChildProxy(owner, name, target);
    const resolvedComponent = (component || FindComponentById(owner.GetComponentId()));
    if (resolvedComponent){ //Register to component
        resolvedComponent.AddProxy(proxy);
    }

    return proxy;
}
