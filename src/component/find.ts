import { GetGlobal } from "../global/get";
import { IComponent } from "../types/component";
import { UseCache } from "../utilities/cache";
import { GetDefaultCacheValue, IComponentCacheInfo } from "./cache";
import { ComponentCacheKey } from "./key";

export function FindComponentById(id: string){
    return UseCache<IComponentCacheInfo, IComponent | null>(() => {
        const component = GetGlobal().FindComponentById(id);
        return {
            id: (component ? id : ''),
            component: component,
        };
    }, ComponentCacheKey, id, GetDefaultCacheValue, cache => [cache.id, cache.component]);
}

export function FindComponentByName(name: string){
    return GetGlobal().FindComponentByName(name);
}

export function FindComponentByRoot(root: HTMLElement){
    return GetGlobal().FindComponentByRoot(root);
}
