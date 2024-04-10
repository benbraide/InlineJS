import { InitCache } from "../utilities/cache";
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
