import { FindComponentById } from "../component/find";
import { AddChanges } from "./add-changes";

export function SetProxyProp(componentId: string, target: any, path: string, prop: string, value: any){
    const exists = (prop in target);
    if (exists && value === target[prop]){//No changes
        return true;
    }

    const component = FindComponentById(componentId);
    component?.FindProxy(path)?.RemoveChild(prop);//Remove previous child proxy, if any
    
    target[prop] = value;

    component?.RemoveProxy(`${path}.${prop}`);
    AddChanges('set', `${path}.${prop}`, prop, component?.GetBackend().changes);

    return true;
}
