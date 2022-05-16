import { ChangeCallbackType, IBubbledChange, IChange } from "../types/change";
import { IChanges, IGetAccessStorageDetails } from "../types/changes";
export declare class Changes implements IChanges {
    private componentId_;
    private nextTickHandlers_;
    private isScheduled_;
    private list_;
    private subscribers_;
    private lastAccessContext_;
    private getAccessStorages_;
    private origins_;
    constructor(componentId_: string);
    GetComponentId(): string;
    AddNextTickHandler(handler: () => void): void;
    Schedule(): void;
    Add(change: IChange | IBubbledChange): void;
    AddComposed(prop: string, prefix?: string, targetPath?: string): void;
    GetLastChange(index?: number): IChange | IBubbledChange | null;
    AddGetAccess(path: string): void;
    GetLastAccessContext(): string;
    ResetLastAccessContext(): void;
    PushGetAccessStorage(storage?: IGetAccessStorageDetails): void;
    PopGetAccessStorage(): IGetAccessStorageDetails | null;
    SwapOptimizedGetAccessStorage(): void;
    RestoreOptimizedGetAccessStorage(): void;
    FlushRawGetAccessStorage(): void;
    PushGetAccessStorageSnapshot(): void;
    PopGetAccessStorageSnapshot(discard?: boolean): void;
    PopAllGetAccessStorageSnapshots(discard?: boolean): void;
    PushOrigin(origin: ChangeCallbackType): void;
    PeekOrigin(): ChangeCallbackType | null;
    PopOrigin(): ChangeCallbackType | null;
    Subscribe(path: string, handler: ChangeCallbackType): string;
    Unsubscribe(subscribed: ChangeCallbackType | string, path?: string): void;
    private Unsubscribe_;
}
