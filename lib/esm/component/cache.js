import { InitCache, GetCache, InvalidateCache } from "../utilities/cache";
import { ComponentCacheKey } from "./key";
export function GetDefaultCacheValue() {
    return {
        id: '',
        component: null,
    };
}
export function InitComponentCache() {
    InitCache(ComponentCacheKey, GetDefaultCacheValue());
}
/**
 * Invalidates a specific component's entry in the cache.
 * @param id The ID of the component to invalidate.
 */
export function InvalidateComponentCache(id) {
    GetCache(ComponentCacheKey, GetDefaultCacheValue).id === id && InvalidateCache(ComponentCacheKey);
}
