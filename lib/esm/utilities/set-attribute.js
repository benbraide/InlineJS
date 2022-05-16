import { SupportsAttributes } from './supports-attributes';
export function SetAttributeUtil(target, attribute, value) {
    if ((attribute && SupportsAttributes(target))) {
        target.setAttribute(attribute, value);
    }
}
