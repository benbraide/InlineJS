import { GetGlobal } from "../global/get";
import { FindComponentById } from "./find";
export function GetLocal(element, name, component, defaultValue = {}) {
    var _a;
    let elementScope = null;
    if (element instanceof HTMLElement) {
        elementScope = (((_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.FindElementScope(element)) || null);
    }
    else {
        elementScope = element;
    }
    if (!elementScope) {
        return defaultValue;
    }
    let value = elementScope.GetLocal(name);
    if (GetGlobal().IsNothing(value)) { //Create key
        elementScope.SetLocal(name, (value = defaultValue));
    }
    return value;
}
