import { InferComponent } from "../component/infer";
import { RetrieveStoredObject } from "./stored-object";
export function DecodeValue(value, componentId, contextElement) {
    var _a;
    return RetrieveStoredObject({
        key: value,
        componentId: (componentId || (contextElement ? (_a = InferComponent(contextElement)) === null || _a === void 0 ? void 0 : _a.GetId() : undefined)),
        contextElement,
    });
}
