import { AnimationActorCallbackType, IAnimationActor, IAnimationActorCallbackDetails, IAnimationActorParams } from "../../types/animation";
import { IsObject } from "../../utilities/is-object";

export function CallAnimationActor(handler: IAnimationActor | IAnimationActorCallbackDetails | AnimationActorCallbackType, params: IAnimationActorParams){
    if (IsObject(handler)){//Details provided
        return (handler as IAnimationActorCallbackDetails).callback(params);
    }

    return ((typeof handler === 'function') ? handler(params) : (handler as IAnimationActor).Handle(params));
}
