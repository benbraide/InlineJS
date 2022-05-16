import { CreateTranslateAnimationCallback } from "../actors/translate/generic";
export function TranslateAnimationCreator(params = {}) {
    return CreateTranslateAnimationCallback(params);
}
