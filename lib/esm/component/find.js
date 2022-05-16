import { GetGlobal } from "../global/get";
const cacheKey = 'InlineJS_Comp_Cache';
export function InitComponentCache() {
    return globalThis[cacheKey] = {
        id: '',
        component: null
    };
}
export function FindComponentById(id) {
    let cache = (globalThis[cacheKey] = (globalThis[cacheKey] || InitComponentCache()));
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
