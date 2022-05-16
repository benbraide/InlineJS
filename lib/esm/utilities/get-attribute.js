import { SupportsAttributes } from './supports-attributes';
function GetAttribute_(target, attribute) {
    return ((attribute && SupportsAttributes(target)) ? target.getAttribute(attribute) : null);
}
export function GetAttribute(target, attributes) {
    for (let attr of (Array.isArray(attributes) ? attributes : [attributes])) {
        let value = GetAttribute_(target, attr);
        if (value) {
            return value;
        }
    }
    return null;
}
