import { AddAnimationActor } from "../add";
import { CreateRotateAnimationActor } from "./generic";
export const FlipAnimationActor = CreateRotateAnimationActor({ name: 'flip', axis: 'y' });
export function FlipAnimationActorCompact() {
    AddAnimationActor(FlipAnimationActor);
}
