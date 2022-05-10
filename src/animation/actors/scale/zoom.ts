import { AddAnimationActor } from "../add";
import { CreateScaleAnimationActor } from "./generic";

export const ZoomAnimationActor = CreateScaleAnimationActor({ name: 'zoom', axis: 'both', origin: { x: 'center', y: 'center' } });

export function ZoomAnimationActorCompact(){
    AddAnimationActor(ZoomAnimationActor);
}
