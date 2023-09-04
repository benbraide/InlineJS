import { InferComponent } from "../component/infer";
import { GetGlobal } from "../global/get";
import { ToString } from "./to-string";

export function EncodeValue(value: any, componentId?: string, contextElement?: HTMLElement){
    if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string'){
        return ToString(value);
    }

    return GetGlobal().StoreObject({
        object: value,
        componentId: (componentId || (contextElement ? InferComponent(contextElement)?.GetId() : undefined)),
        contextElement,
    });
}
