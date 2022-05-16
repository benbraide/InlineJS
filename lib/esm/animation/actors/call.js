import { IsObject } from "../../utilities/is-object";
export function CallAnimationActor(handler, params) {
    if (IsObject(handler)) { //Details provided
        return handler.callback(params);
    }
    return ((typeof handler === 'function') ? handler(params) : handler.Handle(params));
}
