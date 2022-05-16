import { AddAnimationActor } from "../add";
import { CreateRotateAnimationActor } from "./generic";
export const TossAnimationActor = CreateRotateAnimationActor({ name: 'toss', axis: 'x' });
export function TossAnimationActorCompact() {
    AddAnimationActor(TossAnimationActor);
}
