import { FindComponentById } from "../component/find";
import { AddChanges } from "./add-changes";

export function DeleteProxyProp(componentId: string, target: any, path: string, prop: string){
    let exists = (prop in target);
    if (!exists){
        return false;
    }
    
    let component = FindComponentById(componentId);
    component?.FindProxy(path)?.RemoveChild(prop);//Remove previous child proxy, if any
    
    delete target[prop];

    component?.RemoveProxy(`${path}.${prop}`);
    AddChanges('delete', path, prop, component?.GetBackend().changes);
    
    return true;
}
