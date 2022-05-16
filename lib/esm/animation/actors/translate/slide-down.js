import { AddAnimationActor } from "../add";
import { CreateTranslateAnimationActor, DefaultTranslateAnimationActorFactor } from "./generic";
export const SlideDownAnimationActor = CreateTranslateAnimationActor({ name: 'slide.down', axis: 'y', factor: -DefaultTranslateAnimationActorFactor });
export function SlideDownAnimationActorCompact() {
    AddAnimationActor(SlideDownAnimationActor);
}
