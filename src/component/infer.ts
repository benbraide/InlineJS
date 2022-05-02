import { GetElementScopeId } from "./element-scope-id";
import { FindComponentById } from "./find";

export function InferComponent(element: HTMLElement | null){
    let matches = GetElementScopeId(element).match(/^Cmpnt\<([0-9_]+)\>/);
    return (matches ? FindComponentById(matches[1]) : null);
}
