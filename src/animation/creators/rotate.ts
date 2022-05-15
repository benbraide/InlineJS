import { CreateRotateAnimationCallback, IRotateAnimationCallbackInfo } from "../actors/rotate/generic";

export function RotateAnimationCreator(params: IRotateAnimationCallbackInfo = {}){
    return CreateRotateAnimationCallback(params);
}
