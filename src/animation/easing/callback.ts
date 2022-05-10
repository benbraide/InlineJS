import { AnimationEaseCallbackType, IAnimationEaseCallbackDetails } from "../../types/animation";

export function CreateAnimationEaseCallback(name: string, callback: AnimationEaseCallbackType): IAnimationEaseCallbackDetails{
    return { name, callback };
}
