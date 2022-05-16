"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekCurrentScope = exports.PopCurrentScope = exports.PushCurrentScope = void 0;
const find_1 = require("./find");
function PushCurrentScope(component, scope) {
    var _a;
    (_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.PushCurrentScope(scope);
}
exports.PushCurrentScope = PushCurrentScope;
function PopCurrentScope(component) {
    var _a;
    return (((_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.PopCurrentScope()) || null);
}
exports.PopCurrentScope = PopCurrentScope;
function PeekCurrentScope(component) {
    var _a;
    return (((_a = ((typeof component === 'string') ? (0, find_1.FindComponentById)(component) : component)) === null || _a === void 0 ? void 0 : _a.PeekCurrentScope()) || null);
}
exports.PeekCurrentScope = PeekCurrentScope;
