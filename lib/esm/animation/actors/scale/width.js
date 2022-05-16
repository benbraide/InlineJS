import { AddAnimationActor } from "../add";
import { CreateScaleAnimationActor } from "./generic";
export const WidthAnimationActor = CreateScaleAnimationActor({ name: 'width', axis: 'x', origin: { x: 'start', y: 'center' } });
export function WidthAnimationActorCompact() {
    AddAnimationActor(WidthAnimationActor);
}
