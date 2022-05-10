import { GetGlobal } from "../../global/get";
import { AnimationActorCallbackType, IAnimationActor, IAnimationActorCallbackDetails, IAnimationConcept } from "../../types/animation";
import { IsObject } from "../../utilities/is-object";

export function AddAnimationActor(handler: IAnimationActor | IAnimationActorCallbackDetails){
    let name = '', callback: AnimationActorCallbackType | null = null;
    if (IsObject(handler)){//Details provided
        ({name, callback} = <IAnimationActorCallbackDetails>handler);
        if (name && callback){
            GetGlobal().GetConcept<IAnimationConcept>('animation')?.GetActorCollection().Add(callback, name);
        }
    }
    else{//Instance provided
        GetGlobal().GetConcept<IAnimationConcept>('animation')?.GetActorCollection().Add(<IAnimationActor>handler);
    }
}
