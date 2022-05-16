import { GetGlobal } from "../../global/get";
import { IsObject } from "../../utilities/is-object";
export function AddAnimationActor(handler) {
    var _a, _b;
    let name = '', callback = null;
    if (IsObject(handler)) { //Details provided
        ({ name, callback } = handler);
        if (name && callback) {
            (_a = GetGlobal().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetActorCollection().Add(callback, name);
        }
    }
    else { //Instance provided
        (_b = GetGlobal().GetConcept('animation')) === null || _b === void 0 ? void 0 : _b.GetActorCollection().Add(handler);
    }
}
