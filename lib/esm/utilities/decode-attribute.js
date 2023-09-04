import { DecodeValue } from "./decode-value";
import { SupportsAttributes } from "./supports-attributes";
import { ToString } from "./to-string";
export function DecodeAttribute(target, name, componentId) {
    const value = ((name && SupportsAttributes(target)) ? target.getAttribute(name) : null);
    return (value ? DecodeValue(value, componentId, target) : ToString(value));
}
