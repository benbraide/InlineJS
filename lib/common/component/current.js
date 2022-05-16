"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeekCurrentComponent = exports.PopCurrentComponent = exports.PushCurrentComponent = void 0;
const get_1 = require("../global/get");
function PushCurrentComponent(componentId) {
    (0, get_1.GetGlobal)().PushCurrentComponent(componentId);
}
exports.PushCurrentComponent = PushCurrentComponent;
function PopCurrentComponent() {
    return (0, get_1.GetGlobal)().PopCurrentComponent();
}
exports.PopCurrentComponent = PopCurrentComponent;
function PeekCurrentComponent() {
    return (0, get_1.GetGlobal)().PeekCurrentComponent();
}
exports.PeekCurrentComponent = PeekCurrentComponent;
