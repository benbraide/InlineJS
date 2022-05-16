import { ApplyRange, ApplyRangeAndTransform, ApplyTransform, FormatValue } from "../../animation/actors/scene/generic";
import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
function CreateAnimationProxy() {
    let callActor = (actor, params) => ((typeof actor === 'function') ? actor(params) : actor.Handle(params));
    let storedConcept = null, methods = {
        collect: (...actors) => {
            let concept = (storedConcept || (storedConcept = GetGlobal().GetConcept('animation')));
            let validActors = actors.map(actor => ((typeof actor === 'string') ? concept === null || concept === void 0 ? void 0 : concept.GetActorCollection().Find(actor) : actor)).filter(actor => !!actor);
            return (params) => validActors.forEach(actor => callActor(actor, params));
        },
        applySceneRange: ApplyRange,
        applySceneTransform: ApplyTransform,
        applySceneRangeAndTransform: ApplyRangeAndTransform,
        formatSceneValue: FormatValue,
    };
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (!prop) {
                return;
            }
            let concept = (storedConcept || (storedConcept = GetGlobal().GetConcept('animation')));
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
export const AnimationMagicHandler = CreateMagicHandlerCallback('animation', () => AnimationProxy);
export function AnimationMagicHandlerCompact() {
    AddMagicHandler(AnimationMagicHandler);
}
