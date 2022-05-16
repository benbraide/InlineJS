import { AddAnimationActor } from "../add";
import { CreateTranslateAnimationActor } from "./generic";
export const SlideLeftAnimationActor = CreateTranslateAnimationActor({ name: 'slide.left', axis: 'x' });
export function SlideLeftAnimationActorCompact() {
    AddAnimationActor(SlideLeftAnimationActor);
}
