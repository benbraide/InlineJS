import { AddAnimationActor } from "../add";
import { CreateTranslateAnimationActor, DefaultTranslateAnimationActorFactor } from "./generic";
export const SlideRightAnimationActor = CreateTranslateAnimationActor({ name: 'slide.right', axis: 'x', factor: -DefaultTranslateAnimationActorFactor });
export function SlideRightAnimationActorCompact() {
    AddAnimationActor(SlideRightAnimationActor);
}
