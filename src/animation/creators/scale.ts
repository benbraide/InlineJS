import { CreateScaleAnimationCallback, IScaleAnimationCallbackInfo } from "../actors/scale/generic";

export function ScaleAnimationCreator(params: IScaleAnimationCallbackInfo = {}){
    return CreateScaleAnimationCallback(params);
}
