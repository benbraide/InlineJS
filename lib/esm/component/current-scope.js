import { FindComponentById } from "./find";
export function PushCurrentScope(component, scope) {
    var _a;
    (_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.PushCurrentScope(scope);
}
export function PopCurrentScope(component) {
    var _a;
    return (((_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.PopCurrentScope()) || null);
}
export function PeekCurrentScope(component) {
    var _a;
    return (((_a = ((typeof component === 'string') ? FindComponentById(component) : component)) === null || _a === void 0 ? void 0 : _a.PeekCurrentScope()) || null);
}
