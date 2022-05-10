import { AddAnimationActor } from "./add";
import { CreateAnimationActorCallback } from "./callback";

export const NullAnimationActor = CreateAnimationActorCallback('null', () => {});

export function NullAnimationActorCompact(){
    AddAnimationActor(NullAnimationActor);
}
