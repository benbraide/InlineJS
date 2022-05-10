import { IAnimationActorCallbackDetails } from "../../types/animation";
import { AddAnimationActor } from "./add";
import { OpacityAnimationActor } from "./opacity";

export const DefaultAnimationActor: IAnimationActorCallbackDetails = { name: 'default', callback: OpacityAnimationActor.callback };

export function DefaultAnimationActorCompact(){
    AddAnimationActor(DefaultAnimationActor);
}
