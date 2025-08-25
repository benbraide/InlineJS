import { IProxyAccessStorage, IProxyAccessStorageEntry } from "../types/storage";

export class ProxyAccessStorage implements IProxyAccessStorage{
    protected storage_: Record<string, IProxyAccessStorageEntry> = {};
    protected isSuspended_ = false;

    public Put(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): void {
        if (this.isSuspended_) return;
        
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);

        const subPaths: string[] = [];
        for (const existingKey in this.storage_) {
            // Check if a more specific path (super-path) already exists. If so, this new path is redundant.
            if (existingKey.startsWith(encodedPath) && (existingKey.length === encodedPath.length || existingKey[encodedPath.length] === '.')) {
                return; // A more specific or equal path exists, so this one is redundant.
            }

            // Check if the new path is a super-path of an existing key (sub-path).
            if (encodedPath.startsWith(existingKey) && (encodedPath.length === existingKey.length || encodedPath[existingKey.length] === '.')) {
                subPaths.push(existingKey);
            }
        }

        // Add the new, most specific path
        this.storage_[encodedPath] = { componentId, path };

        // Remove all less specific paths (sub-paths)
        subPaths.forEach(subPath => delete this.storage_[subPath]);
    }

    public Remove(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): void {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        delete this.storage_[ProxyAccessStorage.EncodeEntryPath(componentId, path)];
    }

    public Clear(): void {
        this.storage_ = {};
    }

    public GetEntries(): Array<IProxyAccessStorageEntry> {
        return Object.values(this.storage_);
    }

    public GetGroupedEntries(): Record<string, Array<IProxyAccessStorageEntry>> {
        const groupedEntries: Record<string, Array<IProxyAccessStorageEntry>> = {};

        for (const key in this.storage_){// Group entries by their Component ID
            const entry = this.storage_[key];
            !groupedEntries[entry.componentId] && (groupedEntries[entry.componentId] = []);
            groupedEntries[entry.componentId].push(entry);
        }

        return groupedEntries;
    }

    public GetLongestPath(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): IProxyAccessStorageEntry | null {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);

        let longestEntry: IProxyAccessStorageEntry | null = null;
        let longestPath = '';

        for (const key in this.storage_){
            // A stored path is a match if it's the same as the input path, or a more specific version of it.
            if (key.startsWith(encodedPath) && (key.length === encodedPath.length || key[encodedPath.length] === '.')) {
                if (key.length > longestPath.length){
                    longestEntry = this.storage_[key];
                    longestPath = key;
                }
            }
        }

        return longestEntry;
    }

    public HasEntry(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string): boolean {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);

        for (const key in this.storage_){
            // A stored path is a match if it's the same as the input path, or a more specific version of it.
            if (key.startsWith(encodedPath) && (key.length === encodedPath.length || key[encodedPath.length] === '.')) {
                return true;
            }
        }

        return false;
    }

    public Count(): number {
        return Object.keys(this.storage_).length;
    }

    public IsEmpty(): boolean {
        return Object.keys(this.storage_).length === 0;
    }

    public Suspend(): void {
        this.isSuspended_ = true;
    }

    public Resume(): void {
        this.isSuspended_ = false;
    }

    public IsSuspended(): boolean {
        return this.isSuspended_;
    }

    public static ResolveDetails(componentIdOrEntry: string | IProxyAccessStorageEntry, pathIn?: string){
        return typeof componentIdOrEntry === 'string' ? { componentId: componentIdOrEntry, path: pathIn || '' } : componentIdOrEntry;
    }

    public static EncodeEntryPath(componentId: string, path: string): string {
        return `${componentId}:${path}`;
    }
}