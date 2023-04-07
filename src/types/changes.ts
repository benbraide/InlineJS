import { Stack } from "../stack";
import { ChangeCallbackType, IBubbledChange, IChange } from "./change";

export interface ISubscriberInfo{
    path: string;
    callback: ChangeCallbackType;
}

export interface IGetAccessDetails{
    compnentId: string;
    path: string;
}

export interface IGetAccessSection{
    entries: Array<IGetAccessDetails>;
    snapshots: Stack<Array<IGetAccessDetails>>;
}

export interface IGetAccessStorageDetails{
    optimized?: IGetAccessSection;
    raw?: IGetAccessSection;
}

export interface IGetAccessStorage{
    details: IGetAccessStorageDetails;
    lastAccessPath: string;
}

export interface IChanges{
    GetComponentId(): string;
    
    AddNextTickHandler(handler: () => void): void;
    AddNextIdleHandler(handler: () => void): void;
    AddNextNonIdleHandler(handler: () => void): void;
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
}
