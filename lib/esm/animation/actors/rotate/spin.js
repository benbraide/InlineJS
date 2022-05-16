import { AddAnimationActor } from "../add";
import { CreateRotateAnimationActor } from "./generic";
export const SpinAnimationActor = CreateRotateAnimationActor({ name: 'spin', axis: 'z' });
export function SpinAnimationActorCompact() {
    AddAnimationActor(SpinAnimationActor);
}
