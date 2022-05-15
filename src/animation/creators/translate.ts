import { CreateTranslateAnimationCallback, ITranslateAnimationCallbackInfo } from "../actors/translate/generic";

export function TranslateAnimationCreator(params: ITranslateAnimationCallbackInfo = {}){
    return CreateTranslateAnimationCallback(params);
}
