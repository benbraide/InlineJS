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

export function FindFirstAttribute(target: any, attributes: Array<string>): { name: string, value: string } | null{
    if (!SupportsAttributes(target)){
        return null;
    }

    for (let attribute of attributes){
        if (target.hasAttribute(attribute)){
            return {
                name: attribute,
                value: target.getAttribute(attribute),
            };
        }
    }

    return null;
}

export function FindFirstAttributeValue(target: any, attributes: Array<string>): string | null{
    let info = FindFirstAttribute(target, attributes);
    return (info ? info.value : null);
}
