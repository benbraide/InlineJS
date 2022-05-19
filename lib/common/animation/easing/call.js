"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallAnimationEase = void 0;
const is_object_1 = require("../../utilities/is-object");
function CallAnimationEase(handler, params) {
    if ((0, is_object_1.IsObject)(handler)) { //Details provided
        return handler.callback(params);
    }
    return ((typeof handler === 'function') ? handler(params) : handler.Handle(params));
}
exports.CallAnimationEase = CallAnimationEase;