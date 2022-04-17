import { SupportsAttributes } from './supports-attributes'

export function SetAttributeUtil(target: any, attribute: string | null, value: string){
    if ((attribute && SupportsAttributes(target))){
        target.setAttribute(attribute, value);
    }
}
