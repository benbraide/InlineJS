"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLocal = void 0;
const get_1 = require("../global/get");
const find_1 = require("./find");
function GetLocal(element, name, component, defaultValue = {}) {
    var _a;
    let elementScope = null;
    if (element instanceof HTMLElement) {
        elementScope = (((_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.FindElementScope(element)) || null);
    }
    else {
        elementScope = element;
    }
    if (!elementScope) {
        return defaultValue;
    }
    let value = elementScope.GetLocal(name);
    if ((0, get_1.GetGlobal)().IsNothing(value)) { //Create key
        elementScope.SetLocal(name, (value = defaultValue));
    }
    return value;
}
exports.GetLocal = GetLocal;
