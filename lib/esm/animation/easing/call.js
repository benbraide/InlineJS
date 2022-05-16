import { IsObject } from "../../utilities/is-object";
export function CallAnimationEase(handler, params) {
    if (IsObject(handler)) { //Details provided
        return handler.callback(params);
    }
    return ((typeof handler === 'function') ? handler(params) : handler.Handle(params));
}
