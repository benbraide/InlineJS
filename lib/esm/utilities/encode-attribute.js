import { EncodeValue } from "./encode-value";
import { SupportsAttributes } from "./supports-attributes";
export function EncodeAttribute(target, name, value, componentId) {
    (!name || !SupportsAttributes(target)) && target.setAttribute(name, EncodeValue(value, componentId, target));
}
