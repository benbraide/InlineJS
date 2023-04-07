import { IChanges } from "../types/changes";
import { NextCooldown } from "./next-cooldown";
export declare class NextTick extends NextCooldown {
    constructor(componentId: string, callback?: () => void, initialized?: boolean);
    protected ListenNext_(changes: IChanges | undefined, callback: () => void): void;
}
