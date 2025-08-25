export interface IProxyAccessStorageEntry{
    componentId: string;
    path: string;
}

export interface IProxyAccessStorage{
    Put(componentIdOrEntry: string | IProxyAccessStorageEntry, path?: string): void;
    Remove(componentIdOrEntry: string | IProxyAccessStorageEntry, path?: string): void;
    Clear(): void;
    GetEntries(): Array<IProxyAccessStorageEntry>;
    GetGroupedEntries(): Record<string, Array<IProxyAccessStorageEntry>>;
    GetLongestPath(componentIdOrEntry: string | IProxyAccessStorageEntry, path?: string): IProxyAccessStorageEntry | null;
    HasEntry(componentIdOrEntry: string | IProxyAccessStorageEntry, path?: string): boolean;
    Count(): number;
    IsEmpty(): boolean;
    Suspend(): void;
    Resume(): void;
    IsSuspended(): boolean;
}
