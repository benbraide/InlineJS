import { IChanges } from "../types/changes";
import { NextCooldown } from "./next-cooldown";

export class NextTick extends NextCooldown{
    public constructor(componentId: string, callback?: () => void, initialized = false){
        super(componentId, callback, initialized);
    }

    protected ListenNext_(changes: IChanges | undefined, callback: () => void){
        changes?.AddNextTickHandler(callback);
    }
}
