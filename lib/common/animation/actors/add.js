"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAnimationActor = void 0;
const get_1 = require("../../global/get");
const is_object_1 = require("../../utilities/is-object");
function AddAnimationActor(handler) {
    var _a, _b;
    let name = '', callback = null;
    if ((0, is_object_1.IsObject)(handler)) { //Details provided
        ({ name, callback } = handler);
        if (name && callback) {
            (_a = (0, get_1.GetGlobal)().GetConcept('animation')) === null || _a === void 0 ? void 0 : _a.GetActorCollection().Add(callback, name);
        }
    }
    else { //Instance provided
        (_b = (0, get_1.GetGlobal)().GetConcept('animation')) === null || _b === void 0 ? void 0 : _b.GetActorCollection().Add(handler);
    }
}
exports.AddAnimationActor = AddAnimationActor;
