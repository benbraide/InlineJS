import { InferComponent } from "../component/infer";
import { EncodeValue } from "./encode-value";
import { SupportsAttributes } from "./supports-attributes";

export function EncodeAttribute(target: any, name: string, value: any, componentId?: string){
    (!name || !SupportsAttributes(target)) && target.setAttribute(name, EncodeValue(value, componentId, target));
}
