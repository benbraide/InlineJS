import { IChanges } from "../types/changes";
export declare class NextCooldown {
    protected componentId_: string;
    protected callback_?: (() => void) | undefined;
    protected initialized_: boolean;
    protected queued_: boolean;
    protected setCallback_: (() => void) | null;
    constructor(componentId_: string, callback_?: (() => void) | undefined, initialized_?: boolean);
    Queue(callback?: () => void): void;
    protected ListenNext_(changes: IChanges | undefined, callback: () => void): void;
}
