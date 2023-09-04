import { GetGlobal } from "../global/get";
import { GetCache, InitCache } from "../utilities/cache";
const cacheKey = 'InlineJS_Comp_Cache';
function GetDefaultCacheValue() {
    return {
        id: '',
        component: null,
    };
}
export function InitComponentCache() {
    InitCache(cacheKey, GetDefaultCacheValue());
}
export function FindComponentById(id) {
    let cache = GetCache(cacheKey, GetDefaultCacheValue());
    if (id === cache.id) {
        return cache.component;
    }
    cache.component = GetGlobal().FindComponentById(id);
    cache.id = (cache.component ? id : '');
    return cache.component;
}
export function FindComponentByName(name) {
    return GetGlobal().FindComponentByName(name);
}
export function FindComponentByRoot(root) {
    return GetGlobal().FindComponentByRoot(root);
}
