"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationMagicHandlerCompact = exports.AnimationMagicHandler = void 0;
const generic_1 = require("../../animation/actors/scene/generic");
const get_1 = require("../../global/get");
const add_1 = require("../../magics/add");
const callback_1 = require("../../magics/callback");
const create_1 = require("../../proxy/create");
function CreateAnimationProxy() {
    let callActor = (actor, params) => ((typeof actor === 'function') ? actor(params) : actor.Handle(params));
    let storedConcept = null, methods = {
        collect: (...actors) => {
            let concept = (storedConcept || (storedConcept = (0, get_1.GetGlobal)().GetConcept('animation')));
            let validActors = actors.map(actor => ((typeof actor === 'string') ? concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find(actor) : actor)).filter(actor => !!actor);
            return (params) => validActors.forEach(actor => callActor(actor, params));
        },
        applySceneRange: generic_1.ApplyRange,
        applySceneTransform: generic_1.ApplyTransform,
        applySceneRangeAndTransform: generic_1.ApplyRangeAndTransform,
        formatSceneValue: generic_1.FormatValue,
    };
    return (0, create_1.CreateInplaceProxy)((0, create_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            if (!prop) {
                return;
            }
            let concept = (storedConcept || (storedConcept = (0, get_1.GetGlobal)().GetConcept('animation')));
            if (!concept) {
                return;
            }
            let creator = concept.GetCreatorCollection().Find(prop);
            if (creator) {
                return creator;
            }
            let actor = concept.GetActorCollection().Find(prop);
            if (actor) {
                return actor;
            }
            let ease = concept.GetEaseCollection().Find(prop);
            if (ease) {
                return ease;
            }
            if (methods.hasOwnProperty(prop)) {
                return methods[prop];
            }
        },
        lookup: [...Object.keys(methods)],
    }));
}
const AnimationProxy = CreateAnimationProxy();
exports.AnimationMagicHandler = (0, callback_1.CreateMagicHandlerCallback)('animation', () => AnimationProxy);
function AnimationMagicHandlerCompact() {
    (0, add_1.AddMagicHandler)(exports.AnimationMagicHandler);
}
exports.AnimationMagicHandlerCompact = AnimationMagicHandlerCompact;
