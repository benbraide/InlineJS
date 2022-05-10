import { AnimationActorCallbackType, IAnimationActorCallbackDetails } from "../../types/animation";

export function CreateAnimationActorCallback(name: string, callback: AnimationActorCallbackType): IAnimationActorCallbackDetails{
    return { name, callback };
}
