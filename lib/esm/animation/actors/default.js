import { AddAnimationActor } from "./add";
import { OpacityAnimationActor } from "./opacity";
export const DefaultAnimationActor = { name: 'default', callback: OpacityAnimationActor.callback };
export function DefaultAnimationActorCompact() {
    AddAnimationActor(DefaultAnimationActor);
}
