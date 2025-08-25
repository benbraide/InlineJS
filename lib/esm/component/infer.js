import { GetElementScopeId } from "./element-scope-id";
import { FindComponentById, FindComponentByCallback } from "./find";
export function InferComponent(element) {
    const matches = GetElementScopeId(element).match(/^Cmpnt\<([0-9_]+)\>/);
    if (matches) { // Use extracted Component ID
        return FindComponentById(matches[1]);
    }
    return FindComponentByCallback(component => component.GetRoot() === element || component.GetRoot().contains(element));
}
