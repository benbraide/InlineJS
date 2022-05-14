import { CreateSceneAnimationCallback, ISceneAnimationCallbackInfo } from "../actors/scene/generic";

export function SceneAnimationCreator(params: ISceneAnimationCallbackInfo){
    return CreateSceneAnimationCallback(params);
}
