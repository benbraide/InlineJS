import { IProxyAccessStorage, IProxyAccessStorageEntry } from "../types/storage";
export declare class ProxyAccessStorage implements IProxyAccessStorage {
    protected storage_: Record<string, IProxyAccessStorageEntry>;
    protected isSuspended_: boolean;
    Put(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): void;
    Remove(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): void;
    Clear(): void;
    GetEntries(): Array<IProxyAccessStorageEntry>;
    GetGroupedEntries(): Record<string, Array<IProxyAccessStorageEntry>>;
    GetLongestPath(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): IProxyAccessStorageEntry | null;
    HasEntry(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): boolean;
    Count(): number;
    IsEmpty(): boolean;
    Suspend(): void;
    Resume(): void;
    IsSuspended(): boolean;
    static ResolveDetails(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): IProxyAccessStorageEntry;
    static EncodeEntryPath(componentId: string, path: string): string;
}
