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
export function FindFirstAttribute(target, attributes) {
    if (!SupportsAttributes(target)) {
        return null;
    }
    for (let attribute of attributes) {
        if (target.hasAttribute(attribute)) {
            return {
                name: attribute,
                value: target.getAttribute(attribute),
            };
        }
    }
    return null;
}
export function FindFirstAttributeValue(target, attributes) {
    let info = FindFirstAttribute(target, attributes);
    return (info ? info.value : null);
}
