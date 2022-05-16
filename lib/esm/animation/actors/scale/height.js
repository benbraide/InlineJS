import { AddAnimationActor } from "../add";
import { CreateScaleAnimationActor } from "./generic";
export const HeightAnimationActor = CreateScaleAnimationActor({ name: 'height', axis: 'y', origin: { x: 'center', y: 'start' } });
export function HeightAnimationActorCompact() {
    AddAnimationActor(HeightAnimationActor);
}
