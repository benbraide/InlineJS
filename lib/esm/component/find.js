import { GetGlobal } from "../global/get";
import { UseCache } from "../utilities/cache";
import { GetDefaultCacheValue } from "./cache";
import { ComponentCacheKey } from "./key";
export function FindComponentById(id) {
    return UseCache(() => {
        const component = GetGlobal().FindComponentById(id);
        return component ? { id, component } : false;
    }, ComponentCacheKey, GetDefaultCacheValue, cache => cache.id === id, cache => cache.component, () => null);
}
export function FindComponentByName(name) {
    return GetGlobal().FindComponentByName(name);
}
export function FindComponentByRoot(root) {
    return GetGlobal().FindComponentByRoot(root);
}
export function FindComponentByCallback(callback) {
    return GetGlobal().FindComponentByCallback(callback);
}
