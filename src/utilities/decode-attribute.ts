import { DecodeValue } from "./decode-value";
import { SupportsAttributes } from "./supports-attributes";
import { ToString } from "./to-string";

export function DecodeAttribute(target: any, name: string, componentId?: string){
    const value = ((name && SupportsAttributes(target)) ? (target.getAttribute(name) as string) : null);
    return (value ? DecodeValue(value, componentId, target) : ToString(value));
}
