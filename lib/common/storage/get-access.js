"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyAccessStorage = void 0;
class ProxyAccessStorage {
    constructor() {
        this.storage_ = {};
        this.isSuspended_ = false;
    }
    Put(componentIdOrEntry, pathIn) {
        if (this.isSuspended_)
            return;
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);
        const subPaths = [];
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
    Remove(componentIdOrEntry, pathIn) {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        delete this.storage_[ProxyAccessStorage.EncodeEntryPath(componentId, path)];
    }
    Clear() {
        this.storage_ = {};
    }
    GetEntries() {
        return Object.values(this.storage_);
    }
    GetGroupedEntries() {
        const groupedEntries = {};
        for (const key in this.storage_) { // Group entries by their Component ID
            const entry = this.storage_[key];
            !groupedEntries[entry.componentId] && (groupedEntries[entry.componentId] = []);
            groupedEntries[entry.componentId].push(entry);
        }
        return groupedEntries;
    }
    GetLongestPath(componentIdOrEntry, pathIn) {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);
        let longestEntry = null;
        let longestPath = '';
        for (const key in this.storage_) {
            // A stored path is a match if it's the same as the input path, or a more specific version of it.
            if (key.startsWith(encodedPath) && (key.length === encodedPath.length || key[encodedPath.length] === '.')) {
                if (key.length > longestPath.length) {
                    longestEntry = this.storage_[key];
                    longestPath = key;
                }
            }
        }
        return longestEntry;
    }
    HasEntry(componentIdOrEntry, pathIn) {
        const { componentId, path } = ProxyAccessStorage.ResolveDetails(componentIdOrEntry, pathIn);
        const encodedPath = ProxyAccessStorage.EncodeEntryPath(componentId, path);
        for (const key in this.storage_) {
            // A stored path is a match if it's the same as the input path, or a more specific version of it.
            if (key.startsWith(encodedPath) && (key.length === encodedPath.length || key[encodedPath.length] === '.')) {
                return true;
            }
        }
        return false;
    }
    Count() {
        return Object.keys(this.storage_).length;
    }
    IsEmpty() {
        return Object.keys(this.storage_).length === 0;
    }
    Suspend() {
        this.isSuspended_ = true;
    }
    Resume() {
        this.isSuspended_ = false;
    }
    IsSuspended() {
        return this.isSuspended_;
    }
    static ResolveDetails(componentIdOrEntry, pathIn) {
        return typeof componentIdOrEntry === 'string' ? { componentId: componentIdOrEntry, path: pathIn || '' } : componentIdOrEntry;
    }
    static EncodeEntryPath(componentId, path) {
        return `${componentId}:${path}`;
    }
}
exports.ProxyAccessStorage = ProxyAccessStorage;
