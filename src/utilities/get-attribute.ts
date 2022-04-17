import { SupportsAttributes } from './supports-attributes'

function GetAttribute_(target: any, attribute: string | null){
    return ((attribute && SupportsAttributes(target)) ? (target.getAttribute(attribute) as string) : null);
}

export function GetAttribute(target: any, attributes: Array<string | null> | string | null){
    for (let attr of (Array.isArray(attributes) ? attributes : [attributes])){
        let value = GetAttribute_(target, attr);
        if (value){
            return value;
        }
    }

    return null;
}
