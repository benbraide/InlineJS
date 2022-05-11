import { GetGlobal } from "../../global/get";
import { AddMagicHandler } from "../../magics/add";
import { CreateMagicHandlerCallback } from "../../magics/callback";
import { BuildGetterProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { AnimationActorCallbackType, IAnimationActor, IAnimationActorParams, IAnimationConcept } from "../../types/animation";

function CreateAnimationProxy(){
    let callActor = (actor: AnimationActorCallbackType | IAnimationActor, params: IAnimationActorParams) => ((typeof actor === 'function') ? actor(params) : actor.Handle(params));
    let storedConcept: IAnimationConcept | null = null, methods = {
        collect: (...actors: (string | AnimationActorCallbackType)[]): AnimationActorCallbackType => {
            let concept = (storedConcept ||(storedConcept =  GetGlobal().GetConcept<IAnimationConcept>('animation')));
            let validActors = actors.map(actor => ((typeof actor === 'string') ? concept?.GetActorCollection().Find(actor) : actor)).filter(actor => !!actor);
            return (params) => validActors.forEach(actor => callActor(actor!, params));
        },
    };

    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if(!prop){
                return;
            }

            let concept = (storedConcept ||(storedConcept =  GetGlobal().GetConcept<IAnimationConcept>('animation')));
            if (!concept){
                return;
            }

            let creator = concept.GetCreatorCollection().Find(prop);
            if (creator){
                return creator;
            }

            let actor = concept.GetActorCollection().Find(prop);
            if (actor){
                return actor;
            }

            let ease = concept.GetEaseCollection().Find(prop);
            if (ease){
                return ease;
            }

            if (methods.hasOwnProperty(prop)){
                return methods[prop];
            }
        },
        lookup: [...Object.keys(methods)],
    }));
}

const AnimationProxy = CreateAnimationProxy();

export const AnimationMagicHandler = CreateMagicHandlerCallback('animation', () => AnimationProxy);

export function AnimationMagicHandlerCompact(){
    AddMagicHandler(AnimationMagicHandler);
}
