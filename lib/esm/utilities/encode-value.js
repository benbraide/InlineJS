import { InferComponent } from "../component/infer";
import { GetGlobal } from "../global/get";
import { ToString } from "./to-string";
export function EncodeValue(value, componentId, contextElement) {
    var _a;
    if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        return ToString(value);
    }
    return GetGlobal().StoreObject({
        object: value,
        componentId: (componentId || (contextElement ? (_a = InferComponent(contextElement)) === null || _a === void 0 ? void 0 : _a.GetId() : undefined)),
        contextElement,
    });
}
