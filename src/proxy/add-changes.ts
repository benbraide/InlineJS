import { ChangeType, IChange } from "../types/change";
import { IChanges } from "../types/changes";

export function AddChanges(type: ChangeType, path: string, prop: string, changes?: IChanges) {
    if (!changes){
        return;
    }
    
    let change: IChange = {
        componentId: changes.GetComponentId(),
        type: type,
        path: path,
        prop: prop,
        origin: changes.PeekOrigin(),
    };
    
    changes.Add(change);

    let parts = path.split('.');
    while (parts.length > 2){//Skip root
        parts.pop();
        changes.Add({
            original: change,
            path: parts.join('.'),
        });
    }
}
