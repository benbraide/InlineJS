import { GetGlobal } from "../global/get";
import { UseCache } from "../utilities/cache";
import { GetDefaultCacheValue } from "./cache";
import { ComponentCacheKey } from "./key";
export function FindComponentById(id) {
    return UseCache(() => {
        const component = GetGlobal().FindComponentById(id);
        return {
            id: (component ? id : ''),
            component: component,
        };
    }, ComponentCacheKey, id, GetDefaultCacheValue, cache => [cache.id, cache.component]);
}
export function FindComponentByName(name) {
    return GetGlobal().FindComponentByName(name);
}
export function FindComponentByRoot(root) {
    return GetGlobal().FindComponentByRoot(root);
}
