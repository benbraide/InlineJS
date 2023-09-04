import { InferComponent } from "../component/infer";
import { RetrieveStoredObject } from "./stored-object";

export function DecodeValue(value: string, componentId?: string, contextElement?: HTMLElement){
    return RetrieveStoredObject({
        key: value,
        componentId: (componentId || (contextElement ? InferComponent(contextElement)?.GetId() : undefined)),
        contextElement,
    });
}
